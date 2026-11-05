BOREGO FUTURISTIC RELEASE — NOV 5 2026

Included: app.html, sw.js, index.html, config.js, manifest.webmanifest and Borego icons.

Supabase changes have already been applied to the existing Borego project: pg_net enabled, a private webhook secret stored in Vault, a protected verifier RPC, a messages AFTER INSERT push trigger, and notify-message Edge Function version 5 deployed. No accounts, chats, or message rows were deleted or reset.

Notification behavior: users enable push themselves from Profile → Notifications. No delayed first-chat permission popup. New message inserts trigger background push from Supabase. Messages are not pushed to the sender; system/blocked/deleted messages are skipped. If a visible Borego window is currently inside that exact conversation, the service worker suppresses its push popup. Other conversations can still notify. Same-conversation notifications replace/group by conversation. Sender avatar is used as notification icon when available.

IMPORTANT: Browser/device permission is still required on each device. Push delivery depends on valid existing VAPID secrets and a valid subscription. A live two-phone/background test has not been possible here.

UPLOAD: Extract this ZIP and replace the matching root-level files in the existing GitHub Pages repository. Do not upload the ZIP itself. Keep the existing Supabase project and all existing data. After publishing, reopen Borego and use Profile → Notifications → Enable notifications on each device.
