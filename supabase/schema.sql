-- Supabase schema for Linque Resourcing CMS
-- Run these statements in the Supabase SQL editor or via supabase-cli.

create extension if not exists "uuid-ossp";

create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  category text,
  tags text[] default '{}',
  excerpt text,
  description text,
  hero_image text,
  read_time_minutes integer default 5,
  content jsonb default '[]'::jsonb,
  status text not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  location text,
  employment_type text,
  department text,
  remote_type text,
  summary text,
  description text,
  responsibilities jsonb default '[]'::jsonb,
  qualifications jsonb default '[]'::jsonb,
  salary_range text,
  apply_email text,
  apply_url text,
  status text not null default 'draft',
  posted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Update timestamp triggers
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at
before update on public.posts
for each row execute procedure public.handle_updated_at();

drop trigger if exists jobs_updated_at on public.jobs;
create trigger jobs_updated_at
before update on public.jobs
for each row execute procedure public.handle_updated_at();

-- Example RLS policies (adjust role checks to match your auth strategy)
alter table public.posts enable row level security;
alter table public.jobs enable row level security;

-- Public read policies (drop and recreate to avoid conflicts)
drop policy if exists "Public posts can be read" on public.posts;
create policy "Public posts can be read"
  on public.posts
  for select
  using (status = 'published');

drop policy if exists "Public jobs can be read" on public.jobs;
create policy "Public jobs can be read"
  on public.jobs
  for select
  using (status = 'published');

-- Admin management policies (drop and recreate to avoid conflicts)
drop policy if exists "Admins manage posts" on public.posts;
create policy "Admins manage posts"
  on public.posts
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Admins manage jobs" on public.jobs;
create policy "Admins manage jobs"
  on public.jobs
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
