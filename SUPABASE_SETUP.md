# KPA SUPABASE SETUP

KPA remains independent from SpeakOut.

KPA website -> Supabase CMS / Admissions
Portal button -> redirect only -> SpeakOut

1. Create a new Supabase project for KPA.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. In Authentication > Users, create the first admin user.
4. Copy that Auth user's UUID and run:
   insert into public.admin_users(user_id,display_name,role,is_active)
   values ('AUTH-USER-UUID','KPA Administrator','super_admin',true);
5. Copy the Supabase Project URL and anon key into `assets/js/supabase-config.js`.
6. Open `/admin/` on the deployed KPA site and sign in.
7. Once the SpeakOut URLs are available, place them in the `speakout` section of `supabase-config.js`.

Optional admission emails:
Deploy `supabase/functions/notify-admission/index.ts` and set these secrets:
- RESEND_API_KEY
- ADMIN_EMAIL
- FROM_EMAIL

Do not put the Supabase service-role key or email API secret in GitHub.
