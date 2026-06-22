# supabase directory

Contains artefacts used to configure the optional Supabase backend for Linque Resourcing.

## Files

| File | Description |
|------|-------------|
| `schema.sql` | SQL statement collection that provisions the `posts` and `jobs` tables, along with required columns and indexes. Import this file into Supabase to mirror the data model used by the site. |
| `functions/job-application-notifications/index.ts` | Edge Function that sends Resend notifications after a job application is submitted. |

When you extend the Supabase schema or add new Edge Functions, update the local files in this directory and the documentation in the root README so other environments stay aligned.
