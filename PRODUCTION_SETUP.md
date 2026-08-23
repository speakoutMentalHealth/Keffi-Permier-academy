# Keffi Premier Academy — V14 Production Setup

This release upgrades the **independent KPA platform**. SpeakOut remains a separate external website; KPA only redirects users to the SpeakOut login/sign-up URLs configured in `assets/js/supabase-config.js`.

## Preserve the working connection
Your existing live `assets/js/supabase-config.js` is already working. **Do not overwrite it.** The deployment patch intentionally excludes that file.

## A. Run the production database migration
In the KPA Supabase project:

1. Open **SQL Editor**.
2. Run `supabase/production_migration.sql` once.
3. Confirm **Success. No rows returned**.

This adds role-based access, admissions email status, audit logs, contact enquiries, public settings, safer media rules, schedules/expiry support, and production indexes without deleting existing KPA records.

## B. Deploy the email notification function
The admission application is always saved first. Email is an additional notification layer.

Deploy:

`supabase/functions/notify-admission/index.ts`

Set these Supabase Function secrets:

- `RESEND_API_KEY` — API key from your Resend account.
- `ADMIN_EMAIL` — KPA inbox that should receive new-application alerts.
- `FROM_EMAIL` — verified sender, for example `Keffi Premier Academy <admissions@yourdomain.com>`.
- `ADMIN_DASHBOARD_URL` — full URL to the KPA `/admin/` page.

The function:

- emails the school a short notification;
- emails the parent their application reference;
- does **not** email sensitive application details;
- records send/failure status in the database;
- prevents repeated sends for the same application.

## C. Deploy the administrator-management function
Deploy:

`supabase/functions/manage-admin/index.ts`

No additional third-party secret is required. Supabase supplies its own server-side environment values. Only a logged-in KPA `super_admin` can create/deactivate/change roles through this function.

## D. Admin roles

- **Super Admin** — full access and user management.
- **School Admin** — admissions, content, enquiries, settings.
- **Content Editor** — news, announcements, media.
- **Admissions Officer** — admissions and enquiries.
- **Viewer** — read-only operational visibility.

Do not share one administrator account between multiple people.

## E. News management
The V14 admin dashboard supports:

- create/edit;
- draft/published/archived;
- scheduled publication date/time;
- featured stories;
- image upload and image preview;
- accessibility alt text;
- archive;
- soft-delete with confirmation.

## F. Announcements
Administrators can manage:

- title and message;
- priority/order;
- activation/deactivation;
- start date/time;
- expiry date/time;
- target link;
- deletion with confirmation.

Only currently active and in-window announcements appear publicly.

## G. Admissions
The admin dashboard now includes:

- search by reference, student, parent, phone or email;
- status filter;
- newest/oldest sorting;
- CSV export;
- email delivery status;
- internal notes;
- confirmation before status changes;
- role-based edit rights.

## H. Contact enquiries
The public Contact form now stores messages in Supabase and surfaces them in the dashboard. Admins can mark them New / In Progress / Resolved / Closed.

## I. Website settings
Use the Admin → Settings panel to store public:

- school email;
- admissions email;
- telephone;
- WhatsApp;
- address.

The Contact page reads these values automatically.

## J. SpeakOut redirects
Keep the actual links only in your existing working config:

```js
speakout: {
  signupUrl: "YOUR REAL SPEAKOUT SIGN-UP URL",
  loginUrl: "YOUR REAL SPEAKOUT LOGIN URL"
}
```

KPA does not share its Supabase database, users, sessions or tokens with SpeakOut.

## K. Security checklist

- Never commit a Supabase service-role key.
- Never commit a Resend API key.
- The browser should contain only the Supabase Project URL + publishable/anon key.
- Keep RLS enabled.
- Do not email full admission records.
- Create separate admin accounts for each staff member.
- Deactivate staff accounts when access is no longer required.
- Keep news images at 5 MB or less.
- Review audit logs for sensitive administrative changes.

## L. Production cleanup
`supabase/cleanup_test_data.sql` contains safe examples for removing known test records. Nothing destructive runs automatically.

Before launch, review any test admissions/news/announcements in the dashboard and remove only records you recognize as test data.
