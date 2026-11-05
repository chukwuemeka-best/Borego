BOREGO — ANDROID GITHUB UPDATE

This updates your EXISTING Borego GitHub Pages repository. It does not create a new app or reset your Supabase data.

FILES
app.html — existing chat app with online Rock Paper Scissors and online Tic-Tac-Toe client code
index.html — website landing page
sw.js — service worker
config.js — public Supabase URL/anon key and public VAPID key
manifest.webmanifest and icon files — PWA install assets

ANDROID
1. Download this ZIP.
2. Open Files / File Manager > Downloads.
3. Tap the ZIP and choose Extract.
4. Open the extracted Borego_Android_Multiplayer_Update folder.
5. Upload the individual files into the ROOT of your existing GitHub repository. Do not upload the ZIP itself.
6. Replace same-named files only. Do not delete unrelated files or folders.

GAME NOTES
Rock Paper Scissors is now enabled for two signed-in users in a one-to-one chat. It uses Supabase game_sessions and the server-side borego_rps_choose RPC. Both players choose secretly; scores are first to 3 points. No computer opponent is used.
Tic-Tac-Toe remains integrated with the existing server RPCs.

IMPORTANT VERIFICATION LIMITS
JavaScript syntax checks passed and the ZIP archive was integrity-tested. The Supabase security advisor still reports existing warnings (including security-definer function notices, missing RLS policies on account_events/admins, and disabled leaked-password protection). Therefore this package is NOT certified as passing every security test.
The game has not been live-tested with two separate Borego accounts/devices in this environment. The invite-to-DM code path was inspected but not end-to-end tested with an actual second account. Test with two accounts before announcing these features as fully working.
The RPS backend migration has already been applied to the existing Supabase project. Do not re-run it manually.
