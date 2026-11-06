BOREGO — UPDATED EXISTING APP

This package updates the existing Borego GitHub Pages PWA. It is not a new app or a new Supabase project.

FILES
- app.html: existing application with media composer, video trim panel, Buzz media and multi-status support, and admin-only ratings overview.
- config.js: existing public Supabase URL/anon key and public VAPID key. Keep it beside app.html.
- sw.js: updated service worker cache version and push notification handling.
- index.html, manifest.webmanifest, icons and logo: existing site assets.
- supabase/migrations: SQL records for the database changes made for this update.

FEATURES ADDED/UPDATED
- Buzz supports text, images and videos up to 15 seconds.
- Up to five active Buzz updates per user; each expires after 22 hours.
- Buzz media is stored in the existing private Supabase `buzz` bucket with RLS and blocking checks.
- Buzz items are synchronized through Supabase Realtime.
- Chat attachment menu offers camera capture, photo selection, video selection and file selection.
- Chat videos longer than five minutes open a trim panel. The selected clip is recorded as WebM using browser MediaRecorder where supported.
- Chat video messages and ordinary files use the existing private `media` bucket and messages table.
- Rating submission uses the existing `submit_rating` Supabase RPC. An admin-only Ratings overview is shown only when `is_admin()` confirms access.
- Push notifications remain controlled by the in-app Notifications setting and the existing VAPID configuration.

DATABASE
The migrations listed here were applied to the existing Supabase project `jcbypoooomvgvkbfzyci`. The database was not reset. Existing accounts, profiles, conversations, messages, groups and relationships were preserved.
The `media` bucket MIME allow-list was relaxed so ordinary file types can be stored; its existing 50 MB bucket size limit remains. The app enforces 25 MB for ordinary files and 50 MB for chat videos.

DEPLOYMENT
1. Back up the current GitHub Pages files.
2. Extract this ZIP.
3. Replace the matching existing site files with these files. Do not create a second app or Supabase project.
4. Keep config.js, app.html, sw.js, index.html, manifest.webmanifest and icon files in the same existing site folder.
5. After deployment, close Borego completely and reopen it so the new service worker can install. If an old version remains cached, refresh the site once while online.

IMPORTANT TEST LIMITATIONS
JavaScript syntax, HTML parsing, manifest JSON and ZIP integrity were checked. This environment cannot run a real Android camera, browser video encoder, two-device push test or live multiplayer session. The trim panel depends on browser MediaRecorder and HTMLVideoElement.captureStream support; browsers that lack those APIs will show an error rather than silently sending an untrimmed long clip. Push delivery still depends on browser permission, a valid VAPID private key configured server-side, and the existing Supabase push function/secrets.

Buzz expiration remains 22 hours, consistent with the prior Borego configuration. Five is the maximum number of concurrently active Buzz items, not the number of items a user can ever post.
