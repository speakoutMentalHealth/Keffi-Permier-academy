-- OPTIONAL PRODUCTION CLEANUP
-- Review before running. These statements are intentionally commented out.

-- Delete only records you know are test records, preferably by reference/title.
-- Example:
-- delete from public.admission_applications where reference_number = 'KPA-ADM-2026-TEST01';
-- delete from public.news_articles where title ilike '%test%';
-- delete from public.announcements where title ilike '%test%';

-- Never run broad DELETE statements against live production data without a backup.
