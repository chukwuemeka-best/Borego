BOREGO - COMBINED UPDATE

PUBLIC WEBSITE FILES
Replace these three files in the ROOT of the existing GitHub Pages repository:
- app.html
- sw.js
- config.js
Do not create a new repository or a new app. Do not upload the supabase folder into the public website root.

WHAT IS INCLUDED IN THIS BUILD
- About Me editor in Profile (160 characters), saved to the existing public.profiles.about_me column.
- Other users can view About Me by tapping the person's name/avatar in a direct chat. Profile reads remain subject to the existing profiles RLS policy (shared conversation relationship).
- Existing profile photo upload to the private avatars bucket and signed URL display.
- Long-press chat actions: Archive, Delete chat, Block/Unblock, Report; group action: Archive/Leave group.
- Reply remains in the message action menu.
- Existing viewport/visual viewport sizing and long-press context-menu suppression.
- Existing notify-message chat push path and notify-event game/audio/video-call event handler.

SUPABASE STATUS
- Existing project already has profiles.about_me and profile read/update RLS policies; no schema change is needed for About Me.
- archive_chat migration is included for reference. It was applied to the existing Supabase project in this work.
- notify-event Edge Function was deployed to the existing Supabase project in this work.
- VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY must be configured as Supabase Edge Function secrets, and the public key must match config.js. Never put the private key in app.html, config.js, or GitHub.

IMPORTANT TEST LIMITS
Static JavaScript syntax and ZIP integrity were checked. Real two-device push delivery, profile visibility between separate accounts, media transfer, and Android viewport behaviour still require live-device testing. Do not treat static checks as proof of live delivery.
