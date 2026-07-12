-- Kör detta i Supabase SQL Editor (Dashboard > SQL Editor > New query) en gång
-- när projektet är skapat. Säkert att köra flera gånger (idempotent).

-- 1. Tabell för sidans redigerbara innehåll (en enda rad, id = 1)
create table if not exists site_content (
  id smallint primary key default 1,
  campaign_name text,
  subtitle text,

  continent_text text,
  continent_image_path text,
  continent_image_position text not null default 'right',

  country_text text,
  country_image_path text,
  country_image_position text not null default 'right',

  region_text text,
  region_image_path text,
  region_image_position text not null default 'right',

  world_audio_path text,

  story_text text,
  story_image_path text,
  story_image_position text not null default 'right',
  story_audio_path text,

  prep_text text,
  prep_image_path text,
  prep_image_position text not null default 'right',

  schedule_text text,
  schedule_image_path text,
  schedule_image_position text not null default 'right',

  closing_text text,
  session_zero_details text,
  hero_video_path text,

  updated_at timestamptz not null default now(),
  constraint site_content_single_row check (id = 1)
);

-- Migrering för tabeller skapade innan Story/Prep/Schema-fälten fanns.
alter table site_content drop column if exists world_text;
alter table site_content add column if not exists continent_text text;
alter table site_content add column if not exists country_text text;
alter table site_content add column if not exists region_text text;
alter table site_content add column if not exists story_text text;
alter table site_content add column if not exists prep_text text;
alter table site_content add column if not exists schedule_text text;

-- Migrering: ljudet flyttar från Prep till Story och Om världen (en
-- gemensam uppläsning per sektion, inte per delfält).
alter table site_content drop column if exists audio_path;
alter table site_content add column if not exists world_audio_path text;
alter table site_content add column if not exists story_audio_path text;

-- Migrering: valfri bild + vänster/höger-placering per textfält.
alter table site_content add column if not exists continent_image_path text;
alter table site_content add column if not exists continent_image_position text not null default 'right';
alter table site_content add column if not exists country_image_path text;
alter table site_content add column if not exists country_image_position text not null default 'right';
alter table site_content add column if not exists region_image_path text;
alter table site_content add column if not exists region_image_position text not null default 'right';
alter table site_content add column if not exists story_image_path text;
alter table site_content add column if not exists story_image_position text not null default 'right';
alter table site_content add column if not exists prep_image_path text;
alter table site_content add column if not exists prep_image_position text not null default 'right';
alter table site_content add column if not exists schedule_image_path text;
alter table site_content add column if not exists schedule_image_position text not null default 'right';

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

-- 2. Storage-bucket för video, ljud och bilder
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
