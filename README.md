# Keffi Premier Academy Frontend Website — Version 2

This version reflects the agreed architecture:

**Keffi Premier Academy public website → SpeakOut Portal → Keffi Premier Academy school workspace**

The school website does NOT contain its own student, parent or admin database or authentication.

## Public website included
- Home
- About
- Academics
- Admissions
- Premier Wellness Club
- News & Events
- Gallery
- Contact
- Portal Gateway

## Portal model
Keffi Premier Academy will first be created as a school inside the SpeakOut Portal.

When the school profile is created:
1. SpeakOut generates a unique school code for Keffi Premier Academy.
2. Students, parents, teachers/volunteers and other approved users open the SpeakOut sign-up page.
3. During registration they enter the school's unique code.
4. The portal links the user to Keffi Premier Academy.
5. Additional role-specific verification should determine what the user is allowed to access.

Recommended role rules:
- Student: school code + student identifier / verification
- Parent: school code + student/child link or invitation
- Teacher / Volunteer: school code + approval or invitation
- School Admin: invitation / approval only

The school code should identify the institution but should NOT by itself grant access to sensitive records.

## Portal URLs to replace
Open `portal.html` and replace:

`https://YOUR-SPEAKOUT-PORTAL/signup?role=student`
`https://YOUR-SPEAKOUT-PORTAL/signup?role=parent`
`https://YOUR-SPEAKOUT-PORTAL/signup?role=staff`
`https://YOUR-SPEAKOUT-PORTAL/login`

with the real SpeakOut Portal routes.

## Removed from Version 1
The following demo frontend-only portal components were removed:
- Student dashboard
- Parent dashboard
- Admin dashboard
- Frontend-only demo authentication

These functions belong inside the SpeakOut Portal, not the public school website.

## GitHub Pages deployment
1. Create a GitHub repository.
2. Upload all files and folders in this project.
3. Commit to `main`.
4. Open Settings → Pages.
5. Select Deploy from a branch.
6. Select `main` and `/ (root)`.
7. Save.

## Before launch
Replace:
- School logo
- Official school colours if needed
- School address
- Phone number
- Email
- School history/profile
- Vision, mission and values
- Proprietor/Principal message
- Authentic photographs
- Admission information
- Social media URLs
- SpeakOut Portal URLs

## Security principle
Do not store:
- real student records
- parent records
- passwords
- health/wellbeing records
- school admin permissions

inside GitHub Pages or frontend JavaScript.

Those remain inside the secure SpeakOut Portal.
