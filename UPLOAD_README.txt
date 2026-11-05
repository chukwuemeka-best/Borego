BOREGO — CUMULATIVE REPAIR UPDATE

This package continues the existing Borego app. It is not a replacement app.

FILES (upload these to the existing GitHub Pages repository root):
- app.html
- sw.js
- config.js

IMPORTANT:
1. Keep the existing Supabase project and all existing tables/accounts/data. Do not reset or recreate the project.
2. Replace the existing root app.html, sw.js and config.js with these files. Do not upload the folder itself.
3. The Supabase database changes for profile discovery, public avatars, About Me access and message Realtime publication have already been applied to the connected existing project. Do not run a database reset.
4. After GitHub Pages publishes, close Borego fully and reopen it online so the updated service worker (borego-v8) refreshes cached files.

CHANGES IN THIS BUILD:
- Profile photos use permanent public avatar URLs rather than 24-hour signed URLs.
- Profile photo upload waits for Supabase to confirm the saved profile path before updating the UI; previous photos are not deleted during replacement.
- Profile search results load and show the user's profile photo.
- Chat profile cards show permanent avatar URLs.
- Chat history and hidden-message query errors are no longer silently treated as empty data.
- Realtime subscription setup failures are logged and retried.
- Service-worker cache version is bumped to refresh the updated app.

LIMITATIONS / TEST STATUS:
- Inline JavaScript syntax checks passed.
- This environment cannot run a real two-device Android test, upload a real user photo through your signed-in session, or verify delivery/read receipts between your users. Please test with two existing accounts after publishing.
- The existing app's remaining features have not been removed or intentionally redesigned.
