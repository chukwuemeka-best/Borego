BOREGO REALTIME RELIABILITY UPDATE

This update is for the EXISTING Borego app only.

FILES
- app.html
- sw.js

INSTALL
1. Extract this ZIP on your phone or computer.
2. Open the existing Borego GitHub repository.
3. Replace the existing root-level app.html with this app.html.
4. Replace the existing root-level sw.js with this sw.js.
5. Commit the changes and allow GitHub Pages to publish.
6. Reopen Borego online. If the old version remains, close the installed app fully and open it again after the service worker refreshes.

WHAT CHANGED
- Realtime subscription handling now has guarded reconnect attempts, backoff, session-token refresh, and a periodic connection watchdog.
- Outgoing messages retry a limited number of times after temporary failures. Before retrying an insert, the app checks for the same conversation/client message ID to reduce duplicate messages if a server response was lost.
- Failed outgoing messages are retried when the device comes back online.
- The in-app notification invitation can reappear occasionally if permission is still undecided: after active chatting, with at least 7 days between reminders and at least 10 additional sent messages. It stops once notification permission is granted or denied. It does not repeatedly pop up after every message.
- The app icon badge now counts the TOTAL number of unread messages, not merely the number of chats, while the app is running and can calculate the current unread count.
- Service worker cache version updated to v7.

IMPORTANT LIMITS
- No Supabase SQL, tables, policies, database functions, Edge Functions, VAPID keys, or project settings were changed.
- The background push notification function was not changed. For the icon badge to update while Borego is fully closed, the push payload must include the current unreadCount. The existing service worker already accepts that field, but the server-side notification function must supply it. This update deliberately does not modify Supabase.
- Android launchers/browser versions differ. The app icon badge is supported only where the browser/installed PWA and phone launcher expose the Badging API; some devices may not display it.
- The retry logic and syntax were checked locally, but live delivery between two separate phones has not been tested. Please test on two accounts/devices after publishing.
- Do not upload this ZIP file itself to the repository. Replace the two existing root files.
