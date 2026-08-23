# Keffi Premier Academy — V14 Production Platform

This release completes the KPA public-site + independent Supabase CMS architecture.

## Included
- secure KPA administrator login;
- role-based administrator permissions;
- admissions search/filter/status/notes/CSV export;
- parent + school admission email notification function;
- email delivery status tracking;
- production news CMS with featured stories, schedules, image preview, archive/delete;
- announcement scheduling, priority, expiry, activation and deletion;
- contact-enquiry backend + dashboard workflow;
- website contact settings;
- administrator account management through a protected Edge Function;
- audit log and notification log;
- hardened Storage/RLS policies;
- production service-worker cache behavior;
- independent SpeakOut redirect architecture.

## Important
Your current live `assets/js/supabase-config.js` already works. Preserve it. Use the deployment patch ZIP, which deliberately does not overwrite this file.

Read `PRODUCTION_SETUP.md` and `DEPLOYMENT_CHECKLIST.md` before deployment.
