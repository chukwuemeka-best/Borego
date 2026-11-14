const V = 'borego-v13-upgrade';
const META = 'borego-meta';
async function metaGet(k) { try { const c = await caches.open(META); const r = await c.match('/__' + k); return r ? await r.json() : null; } catch (_) { return null; } }
async function metaSet(k, v) { try { const c = await caches.open(META); await c.put('/__' + k, new Response(JSON.stringify(v), { headers: { 'Content-Type': 'application/json' } })); } catch (_) {} }
const FILES = [
  './', 'index.html', 'app.html', 'config.js', 'sw.js',
  'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(V);
    await Promise.all(FILES.map(async path => {
      try {
        const response = await fetch(path, { cache: 'reload' });
        if (response.ok) await cache.put(path, response);
      } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key !== V && key !== META).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok) {
        const copy = response.clone();
        caches.open(V).then(cache => cache.put(request, copy)).catch(() => {});
      }
      return response;
    } catch (_) {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const app = await caches.match('app.html');
        if (app) return app;
        const home = await caches.match('index.html');
        if (home) return home;
      }
      return Response.error();
    }
  })());
});

async function boregoChatIsVisible(conversationId) {
  if (!conversationId) return false;
  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const client of windows) {
    if (client.visibilityState !== 'visible') continue;
    const active = await new Promise(resolve => {
      const channel = new MessageChannel();
      let settled = false;
      const finish = value => {
        if (settled) return;
        settled = true;
        try { channel.port1.close(); } catch (_) {}
        resolve(!!value);
      };
      channel.port1.onmessage = event => finish(event.data && event.data.active);
      setTimeout(() => finish(false), 450);
      try {
        client.postMessage({ type: 'BOREGO_CHECK_ACTIVE_CHAT', conversationId }, [channel.port2]);
      } catch (_) { finish(false); }
    });
    if (active) return true;
  }
  return false;
}

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch (_) { try { data = { body: event.data.text() }; } catch (__) {} }
  event.waitUntil((async () => {
    const visible = await boregoChatIsVisible(String(data.conversationId || ''));
    await metaSet('lastpush', { ts: Date.now(), shown: !visible, title: String(data.title || '').slice(0, 40) });
    if (visible) return;
    const prefs = (await metaGet('prefs')) || {};
    if (prefs.locked && data.conversationId && prefs.locked.includes(String(data.conversationId))) {
      data.title = 'Borego'; data.body = 'New message'; data.avatarUrl = ''; data.icon = 'icon-192.png'; data.tag = 'borego-locked'; data.conversationId = '';
    }
    const count = Number(data.unreadCount);
    if (Number.isFinite(count) && 'setAppBadge' in self.registration) {
      try {
        if (count > 0) await self.registration.setAppBadge(count);
        else if ('clearAppBadge' in self.registration) await self.registration.clearAppBadge();
      } catch (_) {}
    }
    const avatar = String(data.avatarUrl || data.icon || 'icon-192.png');
    const kind = String(data.kind || '');
    const options = {
      body: String(data.body || '').slice(0, 200),
      icon: avatar,
      badge: 'icon-192.png',
      timestamp: Number(data.ts) || Date.now(),
      data: { url: data.url || 'app.html', conversationId: data.conversationId || '' },
      renotify: true
    };
    let title = String(data.title || 'Borego').slice(0, 80);
    if (data.conversationId && !/^(audio_call|video_call|game_invite|game_room_invite)$/.test(kind)) {
      // WhatsApp style: one notification per chat that stacks the latest lines
      const tag = 'borego-chat-' + String(data.conversationId);
      options.tag = tag;
      let lines = [];
      let total = 0;
      try {
        const old = await self.registration.getNotifications({ tag });
        if (old[0] && old[0].data) { lines = old[0].data.lines || []; total = old[0].data.total || 0; }
      } catch (_) {}
      lines.push(String(data.body || '').slice(0, 120));
      lines = lines.slice(-5);
      total += 1;
      options.data.lines = lines;
      options.data.total = total;
      options.body = lines.join('\n');
      if (total > 1) title = title + ' (' + total + ' messages)';
      options.vibrate = [120, 60, 120];
    }
    if (data.tag) options.tag = String(data.tag).slice(0, 80);
    if (/^(audio_call|video_call)$/.test(kind)) { options.requireInteraction = true; options.renotify = true; options.vibrate = [300, 150, 300, 150, 300, 150, 300]; }
    else if (/^(game_invite|game_room_invite)$/.test(kind)) { options.requireInteraction = true; options.renotify = true; }
    if (prefs.quiet && !/^(audio_call|video_call)$/.test(kind)) { options.silent = true; delete options.vibrate; }
    await self.registration.showNotification(title, options);
  })());
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const data = event.notification.data || {};
  const target = new URL(data.url || 'app.html', self.registration.scope);
  if (data.conversationId) target.searchParams.set('conversation', String(data.conversationId));
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async windows => {
    for (const client of windows) {
      if (client.url.startsWith(self.registration.scope) && 'focus' in client) {
        await client.focus();
        try { client.postMessage({ type: 'BOREGO_OPEN_CHAT', conversationId: data.conversationId || '' }); } catch (_) {}
        if (/call=|invite=/.test(target.search) && 'navigate' in client) return client.navigate(target.href);
        return;
      }
    }
    return self.clients.openWindow(target.href);
  }));
});

self.addEventListener('pushsubscriptionchange', event => {
  event.waitUntil((async () => {
    await metaSet('subchange', { ts: Date.now() });
    try {
      const prefs = (await metaGet('prefs')) || {};
      if (prefs.key) {
        const p = '='.repeat((4 - prefs.key.length % 4) % 4), raw = atob((prefs.key + p).replace(/-/g, '+').replace(/_/g, '/'));
        const arr = new Uint8Array(raw.length); for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
        await self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: arr });
      }
    } catch (_) {}
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    windows.forEach(c => { try { c.postMessage({ type: 'BOREGO_RESYNC_PUSH' }); } catch (_) {} });
  })());
});
