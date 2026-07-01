-- Supabase schema for Linque Resourcing CMS
-- Run these statements in the Supabase SQL editor or via supabase-cli.

create extension if not exists "uuid-ossp";
create extension if not exists pg_net;

-- Security definer helpers live in a private schema so they stay out of the public Data API surface.
create schema if not exists private;
revoke all on schema private from public;

create table if not exists private.application_integration_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

revoke all on private.application_integration_settings from public, anon, authenticated;

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
  application_settings jsonb not null default '{"applicationsEnabled": false, "screeningQuestionKeys": [], "placeholders": {"experienceArea": "", "commuteLocation": "", "requiredDegreeOrCertificate": "", "requiredSkill": "", "relocationLocation": ""}}'::jsonb,
  status text not null default 'draft',
  posted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_applications (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  job_slug text not null,
  job_title text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  desired_pay text not null,
  work_authorization text not null,
  available_start_date text not null,
  highest_education text not null,
  why_interested text not null,
  background_check_consent boolean not null default false,
  future_role_interest boolean not null default false,
  professional_references jsonb not null default '[]'::jsonb,
  screening_answers jsonb not null default '[]'::jsonb,
  resume_bucket text not null default 'job-applications',
  resume_path text not null,
  resume_file_name text not null,
  resume_content_type text not null,
  review_status text not null default 'new',
  admin_notes text,
  notification_status text not null default 'pending',
  notification_error text,
  notification_attempted_at timestamptz,
  internal_notification_sent_at timestamptz,
  applicant_confirmation_sent_at timestamptz,
  internal_notification_email_id text,
  applicant_confirmation_email_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_application_eeo (
  application_id uuid primary key,
  job_id uuid not null references public.jobs(id) on delete cascade,
  race_ethnicity text not null,
  gender text not null,
  veteran_status text not null,
  disability_status text not null,
  -- notification_* columns retained for backwards-compat with the retired EEO email edge function.
  -- They can be dropped once the DB trigger is removed and the column is confirmed unused.
  notification_status text not null default 'sent',
  notification_error text,
  notification_attempted_at timestamptz,
  notification_email_id text,
  created_at timestamptz not null default now()
);

create or replace function public.submit_job_application(application_payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_application_id uuid;
  submitted_job_id uuid;
  job_is_open boolean;
begin
  inserted_application_id := (application_payload ->> 'applicationId')::uuid;
  submitted_job_id := (application_payload ->> 'jobId')::uuid;

  select exists (
    select 1
    from public.jobs
    where id = submitted_job_id
      and status = 'published'
      and coalesce((application_settings ->> 'applicationsEnabled')::boolean, false) = true
  )
  into job_is_open;

  if not job_is_open then
    raise exception 'This role is not accepting internal applications.';
  end if;

  if not exists (
    select 1
    from public.job_application_eeo
    where application_id = inserted_application_id
      and job_id = submitted_job_id
  ) then
    raise exception 'A matching EEO response is required before the application can be submitted.';
  end if;

  -- The public application endpoint writes only operational hiring data.
  insert into public.job_applications (
    id,
    job_id,
    job_slug,
    job_title,
    full_name,
    email,
    phone,
    address,
    desired_pay,
    work_authorization,
    available_start_date,
    highest_education,
    why_interested,
    background_check_consent,
    future_role_interest,
    professional_references,
    screening_answers,
    resume_bucket,
    resume_path,
    resume_file_name,
    resume_content_type
  )
  values (
    inserted_application_id,
    submitted_job_id,
    application_payload ->> 'jobSlug',
    application_payload ->> 'jobTitle',
    application_payload ->> 'fullName',
    application_payload ->> 'email',
    application_payload ->> 'phone',
    application_payload ->> 'address',
    application_payload ->> 'desiredPay',
    application_payload ->> 'workAuthorization',
    application_payload ->> 'availableStartDate',
    application_payload ->> 'highestEducation',
    application_payload ->> 'whyInterested',
    coalesce((application_payload ->> 'backgroundCheckConsent')::boolean, false),
    coalesce((application_payload ->> 'futureRoleInterest')::boolean, false),
    coalesce(application_payload -> 'professionalReferences', '[]'::jsonb),
    coalesce(application_payload -> 'screeningAnswers', '[]'::jsonb),
    application_payload ->> 'resumeBucket',
    application_payload ->> 'resumePath',
    application_payload ->> 'resumeFileName',
    application_payload ->> 'resumeContentType'
  )
  returning id into inserted_application_id;

  -- EEO email notifications were retired; individual EEO responses are no longer forwarded
  -- to a compliance inbox. Aggregate counts are surfaced in the admin dashboard instead.

  return inserted_application_id;
end;
$$;

create or replace function public.submit_job_application_eeo(eeo_payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_application_id uuid;
  submitted_job_id uuid;
  job_is_open boolean;
begin
  -- The EEO endpoint is intentionally separate so the protected-class questionnaire never shares a write path with the application record.
  inserted_application_id := (eeo_payload ->> 'applicationId')::uuid;
  submitted_job_id := (eeo_payload ->> 'jobId')::uuid;

  select exists (
    select 1
    from public.jobs
    where id = submitted_job_id
      and status = 'published'
      and coalesce((application_settings ->> 'applicationsEnabled')::boolean, false) = true
  )
  into job_is_open;

  if not job_is_open then
    raise exception 'This role is not accepting internal applications.';
  end if;

  insert into public.job_application_eeo (
    application_id,
    job_id,
    race_ethnicity,
    gender,
    veteran_status,
    disability_status
  )
  values (
    inserted_application_id,
    submitted_job_id,
    eeo_payload ->> 'raceEthnicity',
    eeo_payload ->> 'gender',
    eeo_payload ->> 'veteranStatus',
    eeo_payload ->> 'disabilityStatus'
  )
  on conflict (application_id) do update
  set job_id = excluded.job_id,
      race_ethnicity = excluded.race_ethnicity,
      gender = excluded.gender,
      veteran_status = excluded.veteran_status,
      disability_status = excluded.disability_status;

  return inserted_application_id;
end;
$$;

create or replace function public.delete_job_application_eeo_draft(application_id uuid, job_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.job_application_eeo
  where job_application_eeo.application_id = delete_job_application_eeo_draft.application_id
    and job_application_eeo.job_id = delete_job_application_eeo_draft.job_id
    and not exists (
      select 1
      from public.job_applications
      where job_applications.id = delete_job_application_eeo_draft.application_id
    );
end;
$$;

create or replace function public.delete_job_application(application_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- The EEO response has no foreign key to job_applications (by design, so the two writes stay
  -- decoupled), so it must be deleted explicitly alongside the application row.
  delete from public.job_application_eeo
  where job_application_eeo.application_id = delete_job_application.application_id;

  delete from public.job_applications
  where job_applications.id = delete_job_application.application_id;
end;
$$;

grant execute on function public.delete_job_application(uuid) to authenticated;

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

drop trigger if exists job_applications_updated_at on public.job_applications;
create trigger job_applications_updated_at
before update on public.job_applications
for each row execute procedure public.handle_updated_at();

create or replace function private.queue_job_application_notification()
returns trigger
language plpgsql
security definer
set search_path = public, private
as $$
declare
  function_url text;
  webhook_secret text;
begin
  -- The trigger reads from a private settings table so anonymous application inserts never need direct access to sensitive values.
  select value
  into function_url
  from private.application_integration_settings
  where key = 'job_application_notifications_url'
  order by updated_at desc
  limit 1;

  select value
  into webhook_secret
  from private.application_integration_settings
  where key = 'job_application_webhook_secret'
  order by updated_at desc
  limit 1;

  if function_url is null or webhook_secret is null then
    raise log 'Job application notification secrets are not configured; skipping application %', new.id;
    return new;
  end if;

  perform net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', webhook_secret
    ),
    body := jsonb_build_object(
      'applicationId', new.id,
      'source', 'job_applications_trigger'
    ),
    timeout_milliseconds := 5000
  );

  return new;
exception
  when others then
    raise log 'Job application notification enqueue failed for %: %', new.id, SQLERRM;
    return new;
end;
$$;

revoke all on function private.queue_job_application_notification() from public, anon, authenticated;

drop trigger if exists queue_job_application_notification on public.job_applications;
create trigger queue_job_application_notification
after insert on public.job_applications
for each row execute function private.queue_job_application_notification();

-- EEO notifications were retired. The private.queue_job_application_eeo_notification function
-- and its trigger have been removed. Run the following in the Supabase SQL editor on existing
-- databases to clean up the retired objects:
--   drop trigger if exists queue_job_application_eeo_notification on public.job_application_eeo;
--   drop function if exists private.queue_job_application_eeo_notification(uuid);

-- Returns de-identified EEO aggregate counts per job for the admin dashboard.
-- Security definer so authenticated callers can read counts without direct table access.
-- language sql avoids PL/pgSQL variable-scoping ambiguity between the job_id return
-- column and the inner correlated subquery references.
create or replace function public.get_job_eeo_summary()
returns table (
  job_id uuid,
  job_title text,
  job_slug text,
  total_responses bigint,
  race_ethnicity_counts jsonb,
  gender_counts jsonb,
  veteran_status_counts jsonb,
  disability_status_counts jsonb
)
language sql
security definer
stable
set search_path = public
as $$
  select
    base.jid,
    j.title,
    j.slug,
    base.total_responses,
    (
      select jsonb_object_agg(rc.race_ethnicity, rc.cnt)
      from (
        select race_ethnicity, count(*)::bigint as cnt
        from public.job_application_eeo r
        where r.job_id = base.jid
        group by race_ethnicity
      ) rc
    ),
    (
      select jsonb_object_agg(gc.gender, gc.cnt)
      from (
        select gender, count(*)::bigint as cnt
        from public.job_application_eeo g
        where g.job_id = base.jid
        group by gender
      ) gc
    ),
    (
      select jsonb_object_agg(vc.veteran_status, vc.cnt)
      from (
        select veteran_status, count(*)::bigint as cnt
        from public.job_application_eeo v
        where v.job_id = base.jid
        group by veteran_status
      ) vc
    ),
    (
      select jsonb_object_agg(dc.disability_status, dc.cnt)
      from (
        select disability_status, count(*)::bigint as cnt
        from public.job_application_eeo d
        where d.job_id = base.jid
        group by disability_status
      ) dc
    )
  from (
    select job_id as jid, count(*)::bigint as total_responses
    from public.job_application_eeo
    group by job_id
  ) base
  join public.jobs j on j.id = base.jid
  order by base.total_responses desc;
$$;

-- Only authenticated admins can call this; security definer bypasses RLS on job_application_eeo.
grant execute on function public.get_job_eeo_summary() to authenticated;

-- Example RLS policies (adjust role checks to match your auth strategy)
alter table public.posts enable row level security;
alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;
alter table public.job_application_eeo enable row level security;

-- Explicit grants keep the Data API behavior predictable for publishable and authenticated clients.
grant usage on schema public to anon, authenticated, service_role;
grant select on public.posts to anon;
grant select on public.jobs to anon;
grant insert on public.job_applications to anon;
grant execute on function public.submit_job_application(jsonb) to anon, authenticated;
grant execute on function public.submit_job_application_eeo(jsonb) to anon, authenticated;
grant execute on function public.delete_job_application_eeo_draft(uuid, uuid) to anon, authenticated;
grant execute on function public.get_job_eeo_summary() to authenticated;
grant select, insert, update, delete on public.posts to authenticated;
grant select, insert, update, delete on public.jobs to authenticated;
grant select, update on public.job_applications to authenticated;
grant all privileges on public.posts, public.jobs, public.job_applications, public.job_application_eeo to service_role;

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

drop policy if exists "Authenticated users can review applications" on public.job_applications;
create policy "Authenticated users can review applications"
  on public.job_applications
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can update applications" on public.job_applications;
create policy "Authenticated users can update applications"
  on public.job_applications
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Candidates can submit applications" on public.job_applications;
create policy "Candidates can submit applications"
  on public.job_applications
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from public.jobs
      where jobs.id = job_applications.job_id
        and jobs.status = 'published'
        and coalesce((jobs.application_settings ->> 'applicationsEnabled')::boolean, false) = true
    )
  );

drop policy if exists "Candidates can submit EEO responses" on public.job_application_eeo;
create policy "Candidates can submit EEO responses"
  on public.job_application_eeo
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from public.jobs
      where jobs.id = job_application_eeo.job_id
        and jobs.status = 'published'
        and coalesce((jobs.application_settings ->> 'applicationsEnabled')::boolean, false) = true
    )
  );

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

-- Create the private resume bucket used by the application workflow.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'job-applications',
  'job-applications',
  false,
  5242880,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Candidates upload resumes" on storage.objects;
create policy "Candidates upload resumes"
  on storage.objects
  for insert
  to anon, authenticated
  with check (
    bucket_id = 'job-applications'
    and (storage.foldername(name))[1] = 'applications'
    and storage.extension(name) in ('pdf', 'doc', 'docx')
  );

drop policy if exists "Authenticated users download resumes" on storage.objects;
create policy "Authenticated users download resumes"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'job-applications'
    and storage.allow_any_operation(array['object.get_authenticated', 'object.get_authenticated_info'])
  );

drop policy if exists "Authenticated users delete resumes" on storage.objects;
create policy "Authenticated users delete resumes"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'job-applications');
