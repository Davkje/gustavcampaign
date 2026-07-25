-- Kör detta i Supabase SQL Editor (Dashboard > SQL Editor > New query) en gång
-- när projektet är skapat. Säkert att köra flera gånger (idempotent).

-- 1. Tabell för sidans fasta innehåll (hero + avslutning), en enda rad, id = 1
create table if not exists site_content (
  id smallint primary key default 1,
  campaign_name text,
  subtitle text,
  hero_video_path text,
  closing_text text,
  session_zero_details text,
  updated_at timestamptz not null default now(),
  constraint site_content_single_row check (id = 1)
);

-- Migrering: de gamla fasta Om världen/Story/Prep/Schema-fälten ersätts av
-- de dynamiska tabellerna sections/subsections nedan.
alter table site_content drop column if exists world_text;
alter table site_content drop column if exists continent_text;
alter table site_content drop column if exists continent_image_path;
alter table site_content drop column if exists continent_image_position;
alter table site_content drop column if exists country_text;
alter table site_content drop column if exists country_image_path;
alter table site_content drop column if exists country_image_position;
alter table site_content drop column if exists region_text;
alter table site_content drop column if exists region_image_path;
alter table site_content drop column if exists region_image_position;
alter table site_content drop column if exists world_audio_path;
alter table site_content drop column if exists story_text;
alter table site_content drop column if exists story_image_path;
alter table site_content drop column if exists story_image_position;
alter table site_content drop column if exists story_audio_path;
alter table site_content drop column if exists prep_text;
alter table site_content drop column if exists prep_image_path;
alter table site_content drop column if exists prep_image_position;
alter table site_content drop column if exists schedule_text;
alter table site_content drop column if exists schedule_image_path;
alter table site_content drop column if exists schedule_image_position;
alter table site_content drop column if exists audio_path;

insert into site_content (id)
values (1)
on conflict (id) do nothing;

alter table site_content enable row level security;

drop policy if exists "Public can read site content" on site_content;
create policy "Public can read site content"
  on site_content for select
  to anon, authenticated
  using (true);

-- Ingen insert/update/delete-policy skapas för anon/authenticated.
-- Adminsidan skriver via service role-nyckeln, som kringgår RLS helt.

-- 2. Dynamiska sektioner (t.ex. "Om världen") och underkategorier
-- (t.ex. "Landet", "Politik") som Gustav själv skapar, döper om, tar bort
-- och sorterar i adminpanelen.
create table if not exists sections (
  id uuid primary key default gen_random_uuid(),
  heading text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists subsections (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references sections(id) on delete cascade,
  heading text not null default '',
  text text not null default '',
  image_path text,
  image_position text not null default 'right',
  image_border boolean not null default true,
  audio_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Migrering: valfri border på bilden, utöver placeringen.
alter table subsections add column if not exists image_border boolean not null default true;

alter table sections enable row level security;
alter table subsections enable row level security;

drop policy if exists "Public can read sections" on sections;
create policy "Public can read sections"
  on sections for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can read subsections" on subsections;
create policy "Public can read subsections"
  on subsections for select
  to anon, authenticated
  using (true);

-- Ingen insert/update/delete-policy för anon/authenticated på något av
-- ovanstående. Adminsidan skriver via service role-nyckeln.

-- 3. Storage-bucket för video, ljud och bilder
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 524288000,
  array[
    'video/mp4', 'video/webm',
    'audio/mpeg', 'audio/wav', 'audio/ogg',
    'image/jpeg', 'image/png', 'image/webp'
  ]
)
on conflict (id) do update
  set public = true,
      file_size_limit = 524288000,
      allowed_mime_types = array[
        'video/mp4', 'video/webm',
        'audio/mpeg', 'audio/wav', 'audio/ogg',
        'image/jpeg', 'image/png', 'image/webp'
      ];

drop policy if exists "Public can read media" on storage.objects;
create policy "Public can read media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

-- Ingen insert/update/delete-policy för anon/authenticated på storage.objects.
-- Fil-uppladdning sker via en signed upload URL som adminsidan begär med
-- service role-nyckeln, vilket kringgår RLS för just den uppladdningen.

-- OBS: file_size_limit (500 MB) begränsas i praktiken också av din Supabase-plans
-- egna gränser för filuppladdning. Justera vid behov i Dashboard > Storage > media > Configuration.
