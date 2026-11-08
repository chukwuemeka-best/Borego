BOREGO — UPGRADED BUILD
=======================

UPLOAD (GitHub Pages): upload every file in this folder to the root of your repository, replacing the old ones
(index.html, app.html, sw.js, config.js, manifest.webmanifest, icon-192.png, icon-512.png, apple-touch-icon.png, logo.png,
and the games/ folder). Order does not matter. After uploading, open Borego once, close it fully and open it again so the
new service worker (borego-v11-upgrade) takes over.

The SQL files in supabase/migrations are ALREADY applied to your Supabase project. They are included for your records.
config.js is your original file (keys unchanged).

WHAT IS NEW
- Contact profile page (black/gold): Message, Voice, Play, Search, Media, Links and Docs, Mute notifications,
  Disappearing messages, Edit name (private to you; the person's real name is never changed), Block, Report Contact, Delete Contact.
- Tap anyone's photo in the chat list for a full preview (tap the row elsewhere to open the chat). Own photo: tap to preview, "Change photo" button changes it.
- Disappearing messages: off by default, per one-to-one chat, applies to both people, either can turn it on/off, a notice appears in the chat.
- Unread divider, chats anchored at the bottom, jump-to-latest button.
- Offline: chats, contacts and small cached profile pictures stay visible; new pictures refresh when back online.
- Profile > "Clear app data on this device": clears the local cache only and reloads from the server (stays signed in, settings kept).
- Audio calls through LiveKit (audio only): one-to-one and squads (up to 8). Credentials stay in your livekit-token function.
- Games: the Play button opens the catalogue. Tic-Tac-Toe and Rock Paper Scissors run through server-validated rooms.
  Invite one friend or choose squad members. Invites show in-app and by push, with Accept/Decline.
- Admin: Profile > "Game catalogue (admin)" (visible to admins) adds/edits/archives games and publishes them (publishing needs the owner account).
- Google Search Console tag is in the <head> of BOTH app.html and index.html.

ADDING YOUR OWN HTML5 GAME
1. Host the game on HTTPS (e.g. a folder in your GitHub Pages repo: https://YOURNAME.github.io/REPO/games/mygame/).
   Supabase Storage cannot be used for the game page (it serves HTML as plain text).
2. Open Borego as admin > Profile > Game catalogue (admin) > Add a game. Fill title, slug, URL, players. As owner, tick
   "commercial rights confirmed" + "multiplayer verified" and give evidence URLs, then "Save and publish".
3. It then appears in every Play menu automatically. See games/_template/index.html for the small message bridge games use.
Games run in a sandbox without access to your login.

NOT TESTED ON REAL DEVICES (please test): LiveKit calls between two phones, push notifications with the app closed,
two real accounts playing live in the UI, Buzz circle, calling from the home-screen app on iPhone.
NOT INCLUDED: WhatsApp-style reaction behaviour, video calls.
