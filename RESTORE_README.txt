BOREGO — ORIGINAL DESIGN RESTORE

This package restores the separately uploaded original Borego app.html design (not the futuristic redesign). The app title and Borego branding are preserved. No database tables, accounts, messages, profile records, or storage data are changed by this package.

The only app.html behavior adjustment is the rating submission flow: it now saves the local rating only after the existing Supabase submit_rating RPC succeeds, and shows an error instead of reporting success when submission fails. The rating interface/design itself is unchanged.

Upload the included files to the same GitHub Pages app location, replacing the matching files. Keep a copy of your currently deployed files before replacing them. This package has not been tested on your phone or deployed to your site. A successful rating test still requires signing in and submitting a test rating in the live app.
