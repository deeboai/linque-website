# supabase directory

Contains artefacts used to configure the optional Supabase backend for Linque Resourcing.

## Files

| File | Description |
|------|-------------|
| `schema.sql` | SQL statement collection that provisions the `posts` and `jobs` tables, along with required columns and indexes. Import this file into Supabase to mirror the data model used by the site. |

When you extend the Supabase schema, update `schema.sql` and the documentation in the root README so other environments stay aligned.*** End Patch
