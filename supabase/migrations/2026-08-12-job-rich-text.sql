-- Adds rich text storage for job posting body fields.
--
-- Run this against an existing database that already has the `jobs` table.
-- A fresh provision from `schema.sql` already includes these columns.
--
-- Safe to re-run: every statement is idempotent, and no existing data is read,
-- rewritten, or dropped. Existing postings keep rendering from their plain-text
-- columns until someone edits them in the admin.

alter table public.jobs add column if not exists summary_html text;
alter table public.jobs add column if not exists description_html text;
alter table public.jobs add column if not exists responsibilities_html text;
alter table public.jobs add column if not exists qualifications_html text;
