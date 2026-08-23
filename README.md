# Keffi Premier Academy — ELITE V5 Interactive Frontend

A premium, mobile-first static frontend designed for GitHub Pages.

## Design intent
The site is designed to be highly engaging for children and families without using addictive dark patterns. Student-facing interactions are short, transparent, optional, non-streak-based and do not track children.

## Full public frontend implemented
- Home
- About the School
- Vision / Mission / Core Values
- Proprietor / Principal Welcome
- Academics
- Admissions
- Contact
- Leadership / Management Team
- Teachers / Staff
- Facilities
- News & Announcements
- Events
- Photo Gallery + lightbox
- Student Achievements
- School Calendar
- Downloads / Documents
- FAQ
- Premier Wellness Club
- Parent & Teacher Programmes
- Train-the-Trainer positioning
- Student leadership
- SpeakOut Portal Gateway
- Student portal access
- Parent resources
- Teacher resources
- Student courses / training
- Leadership resources
- Mental-health / wellbeing resources
- WhatsApp placeholder
- Click-to-call / email placeholders
- Contact and admission forms
- Google Maps placeholder
- Facebook / Instagram / YouTube / TikTok placeholders
- Announcements ticker
- Website search
- Mobile mega navigation
- Accessibility controls
- PWA manifest

## Interactive features
- Cinematic hero slideshow
- Search modal
- Mega-menu desktop navigation
- Full-screen mobile navigation
- Interactive KPA Journey tabs
- Interactive Premier Wellness ecosystem
- Student 60-second learning challenge
- Private, non-persistent wellbeing check-in demo
- Testimonial slider
- News / Events / Staff / Gallery filters
- Gallery lightbox
- FAQ accordions
- Responsive calendar
- Floating WhatsApp and Portal actions
- Accessibility controls (larger text, contrast, reduced motion)
- Scroll reveal animations with reduced-motion support

## SpeakOut architecture
Public KPA Website → SpeakOut Portal → Keffi Premier Academy School Workspace.

The public GitHub site must NOT store passwords, student records, parent records, wellbeing information or admin permissions.

### Replace these portal placeholders
Search `portal.html` for:
- https://YOUR-SPEAKOUT-PORTAL/signup?role=student
- https://YOUR-SPEAKOUT-PORTAL/signup?role=parent
- https://YOUR-SPEAKOUT-PORTAL/signup?role=staff
- https://YOUR-SPEAKOUT-PORTAL/login
- https://YOUR-SPEAKOUT-PORTAL/

## Content to replace before launch
- School address
- Official phone / WhatsApp
- Official email
- Social URLs
- Google Maps embed/location
- Approved school history
- Vision, mission and core values
- Proprietor / Principal message
- Leadership / staff names and photographs
- Authentic KPA campus and student photography
- Curriculum / academic details
- Admission requirements
- Official event dates
- Downloads / prospectus / forms
- Authentic testimonials
- Actual SpeakOut portal URLs

## GitHub Pages
1. Create or open the KPA GitHub repository.
2. Upload all files and folders in this package to the repository root.
3. Commit to `main`.
4. Go to Settings → Pages.
5. Choose Deploy from a branch.
6. Select `main` and `/ (root)`.
7. Save.

## File structure
- `index.html`
- `about.html`
- `academics.html`
- `admissions.html`
- `wellness.html`
- `leadership.html`
- `facilities.html`
- `news.html`
- `events.html`
- `gallery.html`
- `achievements.html`
- `calendar.html`
- `downloads.html`
- `faq.html`
- `contact.html`
- `portal.html`
- `assets/css/styles.css`
- `assets/js/main.js`
- `assets/images/...`
- `manifest.webmanifest`
