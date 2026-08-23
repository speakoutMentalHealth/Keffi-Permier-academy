-- ============================================================
-- KEFFI PREMIER ACADEMY — V14 PRODUCTION MIGRATION
-- Safe incremental upgrade for an existing working V13 database.
-- Run ONCE in Supabase SQL Editor.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- helpers ----------
create or replace function public.kpa_admin_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.admin_users
  where user_id = auth.uid() and is_active = true
  limit 1;
$$;

create or replace function public.kpa_has_role(allowed text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.kpa_admin_role() = any(allowed), false);
$$;

create or replace function public.is_kpa_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.kpa_has_role(array['super_admin','school_admin','editor','admissions','viewer']);
$$;

-- ---------- strengthen admin role constraint ----------
alter table if exists public.admin_users
  drop constraint if exists admin_users_role_check;
alter table if exists public.admin_users
  drop constraint if exists admin_role_check;
alter table if exists public.admin_users
  add constraint admin_users_role_check
  check (role in ('super_admin','school_admin','editor','admissions','viewer'));

-- ---------- news upgrades ----------
alter table if exists public.news_articles add column if not exists image_alt text;
alter table if exists public.news_articles add column if not exists archived_at timestamptz;
alter table if exists public.news_articles add column if not exists deleted_at timestamptz;
alter table if exists public.news_articles add column if not exists updated_by uuid references auth.users(id);

-- ---------- announcement upgrades ----------
alter table if exists public.announcements add column if not exists updated_by uuid references auth.users(id);
alter table if exists public.announcements add column if not exists deleted_at timestamptz;

-- ---------- admission upgrades ----------
alter table if exists public.admission_applications add column if not exists email_status text not null default 'pending';
alter table if exists public.admission_applications add column if not exists email_sent_at timestamptz;
alter table if exists public.admission_applications add column if not exists email_error text;
alter table if exists public.admission_applications add column if not exists last_contacted_at timestamptz;
alter table if exists public.admission_applications add column if not exists status_changed_at timestamptz not null default now();
alter table if exists public.admission_applications add column if not exists assigned_to uuid references auth.users(id);

-- ---------- audit log ----------
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id),
  actor_role text,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.audit_log enable row level security;

-- ---------- contact enquiries ----------
create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  enquiry_type text,
  message text not null,
  status text not null default 'new' check (status in ('new','in_progress','resolved','closed')),
  internal_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  handled_by uuid references auth.users(id)
);
alter table public.contact_enquiries enable row level security;

-- ---------- website settings ----------
create table if not exists public.website_settings (
  key text primary key,
  value text,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);
alter table public.website_settings enable row level security;

-- ---------- notification log ----------
create table if not exists public.notification_log (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.admission_applications(id) on delete cascade,
  channel text not null default 'email',
  recipient_type text not null,
  recipient text,
  status text not null,
  provider_message_id text,
  error text,
  created_at timestamptz not null default now()
);
alter table public.notification_log enable row level security;

-- ---------- clean existing policies ----------
drop policy if exists "admins admin users" on public.admin_users;
drop policy if exists "admins admin_users" on public.admin_users;
drop policy if exists "admins news" on public.news_articles;
drop policy if exists "admins announcements" on public.announcements;
drop policy if exists "admins admissions" on public.admission_applications;
drop policy if exists "public published news" on public.news_articles;
drop policy if exists "public active announcements" on public.announcements;
drop policy if exists "public admission insert" on public.admission_applications;

-- public read / submission policies
create policy "public published news"
on public.news_articles for select to anon, authenticated
using (status='published' and deleted_at is null and published_at is not null and published_at <= now());

create policy "public active announcements"
on public.announcements for select to anon, authenticated
using (
  is_active=true and deleted_at is null
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);

create policy "public admission insert"
on public.admission_applications for insert to anon, authenticated
with check (
  consent=true and status='new'
  and char_length(student_first_name) between 1 and 100
  and char_length(student_last_name) between 1 and 100
  and char_length(parent_name) between 1 and 150
  and char_length(parent_email) between 5 and 254
  and char_length(parent_phone) between 5 and 40
);

-- role-aware admin policies
create policy "own admin profile read"
on public.admin_users for select to authenticated
using (user_id = auth.uid());

create policy "admin users read"
on public.admin_users for select to authenticated
using (public.kpa_has_role(array['super_admin','school_admin']));

create policy "super admin manages users"
on public.admin_users for all to authenticated
using (public.kpa_has_role(array['super_admin']))
with check (public.kpa_has_role(array['super_admin']));

create policy "content roles read news"
on public.news_articles for select to authenticated
using (public.kpa_has_role(array['super_admin','school_admin','editor','viewer']));

create policy "content roles manage news"
on public.news_articles for insert to authenticated
with check (public.kpa_has_role(array['super_admin','school_admin','editor']));
create policy "content roles update news"
on public.news_articles for update to authenticated
using (public.kpa_has_role(array['super_admin','school_admin','editor']))
with check (public.kpa_has_role(array['super_admin','school_admin','editor']));
create policy "content roles delete news"
on public.news_articles for delete to authenticated
using (public.kpa_has_role(array['super_admin','school_admin']));

create policy "content roles read announcements"
on public.announcements for select to authenticated
using (public.kpa_has_role(array['super_admin','school_admin','editor','viewer']));
create policy "content roles insert announcements"
on public.announcements for insert to authenticated
with check (public.kpa_has_role(array['super_admin','school_admin','editor']));
create policy "content roles update announcements"
on public.announcements for update to authenticated
using (public.kpa_has_role(array['super_admin','school_admin','editor']))
with check (public.kpa_has_role(array['super_admin','school_admin','editor']));
create policy "content roles delete announcements"
on public.announcements for delete to authenticated
using (public.kpa_has_role(array['super_admin','school_admin']));

create policy "admission roles read admissions"
on public.admission_applications for select to authenticated
using (public.kpa_has_role(array['super_admin','school_admin','admissions','viewer']));
create policy "admission roles update admissions"
on public.admission_applications for update to authenticated
using (public.kpa_has_role(array['super_admin','school_admin','admissions']))
with check (public.kpa_has_role(array['super_admin','school_admin','admissions']));

create policy "public contact insert"
on public.contact_enquiries for insert to anon, authenticated
with check (status='new' and char_length(name) between 1 and 150 and char_length(message) between 1 and 5000);
create policy "admins read enquiries"
on public.contact_enquiries for select to authenticated
using (public.kpa_has_role(array['super_admin','school_admin','admissions','viewer']));
create policy "admins update enquiries"
on public.contact_enquiries for update to authenticated
using (public.kpa_has_role(array['super_admin','school_admin','admissions']))
with check (public.kpa_has_role(array['super_admin','school_admin','admissions']));

create policy "public read website settings"
on public.website_settings for select to anon, authenticated
using (key in ('school_email','admissions_email','school_phone','whatsapp','school_address'));

create policy "admins read settings"
on public.website_settings for select to authenticated
using (public.is_kpa_admin());
create policy "school admins manage settings"
on public.website_settings for all to authenticated
using (public.kpa_has_role(array['super_admin','school_admin']))
with check (public.kpa_has_role(array['super_admin','school_admin']));

create policy "admins read audit"
on public.audit_log for select to authenticated
using (public.kpa_has_role(array['super_admin','school_admin','viewer']));
create policy "admins insert audit"
on public.audit_log for insert to authenticated
with check (public.is_kpa_admin());

create policy "admins read notification log"
on public.notification_log for select to authenticated
using (public.kpa_has_role(array['super_admin','school_admin','admissions','viewer']));

-- ---------- storage hardening ----------
drop policy if exists "public media read" on storage.objects;
drop policy if exists "admin media insert" on storage.objects;
drop policy if exists "admin media update" on storage.objects;
drop policy if exists "admin media delete" on storage.objects;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values(
  'website-media','website-media',true,5242880,
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict(id) do update set
  public=true,
  file_size_limit=5242880,
  allowed_mime_types=array['image/jpeg','image/png','image/webp','image/gif'];

create policy "public media read" on storage.objects
for select to anon,authenticated
using(bucket_id='website-media');

create policy "content upload media" on storage.objects
for insert to authenticated
with check(bucket_id='website-media' and public.kpa_has_role(array['super_admin','school_admin','editor']));

create policy "content update media" on storage.objects
for update to authenticated
using(bucket_id='website-media' and public.kpa_has_role(array['super_admin','school_admin','editor']))
with check(bucket_id='website-media' and public.kpa_has_role(array['super_admin','school_admin','editor']));

create policy "admin delete media" on storage.objects
for delete to authenticated
using(bucket_id='website-media' and public.kpa_has_role(array['super_admin','school_admin']));

-- ---------- useful indexes ----------
create index if not exists idx_news_public on public.news_articles(status,deleted_at,published_at desc);
create index if not exists idx_news_featured on public.news_articles(featured desc,published_at desc);
create index if not exists idx_ann_schedule on public.announcements(is_active,deleted_at,priority desc,starts_at,ends_at);
create index if not exists idx_adm_search on public.admission_applications(status,created_at desc);
create index if not exists idx_contact_status on public.contact_enquiries(status,created_at desc);
create index if not exists idx_audit_created on public.audit_log(created_at desc);

-- ---------- default settings ----------
insert into public.website_settings(key,value) values
  ('school_email',''),
  ('admissions_email',''),
  ('school_phone',''),
  ('whatsapp',''),
  ('school_address','')
on conflict(key) do nothing;

-- Production migration complete.
