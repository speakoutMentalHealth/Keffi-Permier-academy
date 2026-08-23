# V14 Deployment Checklist

- [ ] Back up/export any KPA data you want to preserve.
- [ ] Run `supabase/production_migration.sql`.
- [ ] Deploy `notify-admission` Edge Function.
- [ ] Configure Resend + KPA email secrets.
- [ ] Deploy `manage-admin` Edge Function.
- [ ] Keep the current working `assets/js/supabase-config.js` unchanged.
- [ ] Upload the V14 patch files to GitHub.
- [ ] Confirm GitHub Pages deployment finishes.
- [ ] Sign into `/admin/`.
- [ ] Verify dashboard role is correct.
- [ ] Submit one admission test and verify dashboard + email status.
- [ ] Publish one news test and verify the News page.
- [ ] Publish one scheduled announcement and verify the top bar.
- [ ] Submit one Contact enquiry and verify it reaches the dashboard.
- [ ] Enter official contact information under Settings.
- [ ] Verify SpeakOut Sign Up and Login redirect to the correct external domain.
- [ ] Remove test records.
- [ ] Test desktop, tablet, iPhone Safari, Android Chrome.
