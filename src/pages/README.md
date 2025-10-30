# src/pages

Route components live here. Each file corresponds to a `react-router-dom` route registered in `App.tsx`. Pages typically compose shared components, pull any required data, and define page-specific SEO metadata.

## Route map

| File | Route | Highlights |
|------|-------|------------|
| `Home.tsx` | `/` | Hero with parallax video, Our Impact narrative, value propositions, and CTAs. |
| `About.tsx` | `/about` | Company story, mission/vision cards, certification badges, and values. |
| `HowWeWork.tsx` | `/how-we-work` | Four-step methodology slideshow and principle cards. |
| `Services.tsx` | `/services` | Full services taxonomy, hero background image, FAQs, and CTA panel. |
| `Resources.tsx` | `/linque-learn` | Filterable Linque Learn article grid fed by Supabase or local data. |
| `ResourceDetail.tsx` | `/linque-learn/:slug` | Article detail view with sticky table of contents and CTA. |
| `Jobs.tsx` | `/jobs` | Filterable job listings reading from `data/jobs.ts` and Supabase. |
| `JobDetail.tsx` | `/jobs/:slug` | Job description, responsibilities, and apply CTA. |
| `Contact.tsx` | `/contact` | Validated contact form that opens the visitor’s email client via `mailto`. |
| `Admin.tsx` | `/admin` | Supabase-powered CMS dashboard for posts and jobs. |
| `NotFound.tsx` | `*` | Friendly 404 page with navigation options. |

### Page conventions

- Use `Seo` to set meta tags and structured data.
- Wrap main sections in `AnimatedSection` to benefit from IntersectionObserver reveals.
- Source reusable copy or configuration from `src/data` when possible.
- Keep page-specific styles in Tailwind classes; avoid inline `<style>` blocks.*** End Patch
