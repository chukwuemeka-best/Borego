BOREGO UPDATE
=============
WHAT TO UPLOAD to GitHub (replace the old files): app.html, sw.js, config.js
(config.js carries the new notification key, so it must be uploaded too.)
Then close Borego completely and open it twice so the new version loads.
The database and server parts are already live. The supabase folder is only a record.

AFTER UPDATING
1. Open Borego, tap Profile, Notifications, and allow alerts.
2. Tap "Send me a test alert". It tells you whether the alert reached the phone.
3. If it does not arrive on Android: Phone Settings, Battery, Borego (or Chrome), set to Unrestricted.
4. iPhone: add Borego to the Home Screen first, then allow alerts.

ADDING YOUR OWN GAME (Profile, Admin, Game catalogue, Add a game)
1. Put your HTML5 game in a GitHub repository and switch on GitHub Pages
   (repository Settings, Pages, deploy from the main branch).
2. In Borego type the game name and paste the repository link
   (for example github.com/yourname/yourgame). Borego turns it into the playable link.
3. Tap Test play to check it, then Publish game. Everyone sees it in the Play menu.
A game folder example is in games/_template.

WHAT IS NEW
- Notifications: re-register automatically, polite reminders, test alert, quiet alerts option.
- Sound settings: Profile, Notifications, Sound settings (on/off, per type, volume).
- New themed sounds for typing, chat and games.
- Games: new Tic-Tac-Toe and Rock-Paper-Scissors, live-stream style emojis and messages.
- Chat lock: contact page, Lock chat. Locked chats are under Locked chats on the chat list.
- Faster opening screen, unread count on the app icon.
- iPad and laptop layouts. Phones look exactly as before.


INSTALL BUTTON (index.html): Android Chrome/Edge/desktop: pressing Install shows the phone's own install box and puts Borego on the home screen. Inside WhatsApp/Facebook/Instagram links it shows "Open in Chrome" steps with a Copy link button. iPhone: Apple does not allow a button to install; it shows the Share > Add to Home Screen steps.
Android links opened inside WhatsApp/Facebook now jump straight to Chrome when Install is pressed (falls back to the steps if the phone refuses).
