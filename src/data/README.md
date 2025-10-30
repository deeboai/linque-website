# src/data

Static content lives here as TypeScript modules. These files provide fallback data when Supabase is unavailable or when you want to run the site without external services.

## Files

| File | Description |
|------|-------------|
| `posts.ts` | Array of `BlogPost` records with hero imagery, metadata, and section content for Linque Learn articles. |
| `jobs.ts` | Array of sample job postings used by the Careers section and job detail pages. |

Each module exports strongly typed objects that match the Supabase schema. When you add new fields to Supabase, update these definitions so the local fallback stays in sync.*** End Patch
