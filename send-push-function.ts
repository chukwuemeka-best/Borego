// BOREGO: sends notifications. Paste this into Supabase -> Edge Functions -> new function named "send-push".
// Only YOU (the admin) can use it. Secrets are set in Supabase, never in this file.
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const reply = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply({ error: "POST only" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const adminId = Deno.env.get("ADMIN_USER_ID") || "";

  // 1. Who is calling? Only the admin account may send.
  const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
  const caller = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data: who } = await caller.auth.getUser();
  if (!adminId || !who?.user || who.user.id !== adminId) return reply({ error: "Not allowed" }, 403);

  // 2. What to send.
  let b: any = {};
  try { b = await req.json(); } catch (_) { return reply({ error: "Bad request" }, 400); }
  const title = String(b.title || "").trim().slice(0, 80);
  const body = String(b.body || "").trim().slice(0, 200);
  if (!title || !body) return reply({ error: "Title and body are required" }, 400);
  const payload = JSON.stringify({ title, body, url: String(b.url || "app.html"), tag: b.tag ? String(b.tag) : undefined });

  webpush.setVapidDetails(
    Deno.env.get("VAPID_SUBJECT") || "mailto:borego.team@gmail.com",
    Deno.env.get("VAPID_PUBLIC_KEY")!,
    Deno.env.get("VAPID_PRIVATE_KEY")!,
  );

  // 3. Who receives it: everyone, or one person if user_id is given.
  const db = createClient(url, service);
  let q = db.from("push_subscriptions").select("id,endpoint,p256dh,auth").limit(5000);
  if (b.user_id) q = q.eq("user_id", String(b.user_id));
  const { data: subs, error } = await q;
  if (error) return reply({ error: "Could not read subscribers" }, 500);

  let sent = 0, removed = 0, failed = 0;
  const dead: number[] = [];
  for (let i = 0; i < (subs || []).length; i += 50) {
    const chunk = (subs || []).slice(i, i + 50);
    await Promise.all(chunk.map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 3600 });
        sent++;
      } catch (e: any) {
        if (e?.statusCode === 404 || e?.statusCode === 410) { dead.push(s.id); removed++; } else failed++;
      }
    }));
  }
  if (dead.length) await db.from("push_subscriptions").delete().in("id", dead);
  return reply({ sent, removed, failed });
});
