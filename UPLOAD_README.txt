BOREGO — EXISTING APP UPDATE

This update is for the existing Borego GitHub Pages project. It is not a new app.

Replace these two existing root-level files in your current GitHub repository:
1. app.html
2. sw.js

Do not upload this ZIP file into the repository. Extract it first, then upload/replace app.html and sw.js in the same folder where the current versions are located.

Included changes:
- Keeps the existing message tick logic (sent, delivered, seen) and the prior typing/unread-chat fixes.
- Adds your own Online / Offline / Connecting status in the Chats header and Profile screen. The status reflects the app's connection to Supabase, not just the phone's Wi-Fi indicator.
- Caches profile pictures already viewed in the browser's Cache Storage so they can remain visible offline. When online again, the app fetches the current profile picture URL so changed pictures refresh.
- Reuses one visible local chat entry per Borego user ID and merges duplicate local chat entries while preserving their locally stored messages. It does not delete database conversations or messages.
- Bumps the service-worker cache version and preserves the profile-picture cache during service-worker updates.

No Google Search Console, Google indexing, or Google search-engine settings were enabled or changed.

No Supabase database migration is required for this frontend update. Existing accounts and server-side conversations/messages are preserved.

After GitHub Pages publishes the update, open Borego online once so profile pictures can be cached. Then test offline viewing. A picture that has never been loaded on that device cannot be shown offline until it has first been cached.
