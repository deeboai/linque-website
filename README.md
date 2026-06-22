# Linque Resourcing Web App

React + TypeScript marketing experience for Linque Resourcing. The site is built with Vite, Tailwind CSS, and the shadcn/ui design system, and is ready for local development or deployment on any static host.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Environment & Tooling](#environment--tooling)
3. [Project Architecture](#project-architecture)
4. [Routes & Feature Overview](#routes--feature-overview)
5. [Key Modules](#key-modules)
6. [Styling & Design Tokens](#styling--design-tokens)
7. [Animation, Performance & Accessibility](#animation-performance--accessibility)
8. [Data & Content Management](#data--content-management)
9. [Build, Lint & Deployment](#build-lint--deployment)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# Clone
git clone <YOUR_GIT_URL>
cd LinQue

# Install dependencies
npm install

# Start local dev server (http://localhost:5173 by default)
npm run dev

# Run linting
npm run lint

# Build for production (output -> dist/)
npm run build

# Preview production bundle locally
npm run preview
```

Hot Module Replacement (HMR) is enabled through Vite, so UI updates appear instantly during development.

---

## Environment & Tooling

| Requirement | Notes |
|-------------|-------|
| **Node.js 18+** | Use the latest LTS release. Install via [nodejs.org](https://nodejs.org/) or [nvm](https://github.com/nvm-sh/nvm). |
| **npm** | Bundled with Node.js. |
| **Git** | Needed if you are cloning from a remote repository. |
| **IDE** | Visual Studio Code, WebStorm, or Visual Studio with the Node.js workload all work well. |

### Environment Variables

The app reads optional variables from `.env` files (create `.env.local` for local overrides):

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_SITE_URL` | Canonical site URL used for SEO `<link rel="canonical">` and structured data. | `https://linqueresourcing.com` |
| `VITE_SCHEDULER_URL` | External scheduling link for CTAs (`Schedule a Call`). | `/contact` fallback |
| `VITE_DISCOVERY_CALL_URL` | Optional discovery call link. | `https://cal.com/linque/discovery` |
| `VITE_CONTACT_ENDPOINT` | Optional legacy API endpoint for the contact form. When omitted the form opens the user's mail client via `mailto`. | `undefined` |
| `VITE_SUPABASE_URL` | Supabase project URL used by the CMS backend. | `undefined` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public API key. Required for both the public site and the admin UI. | `undefined` |
| `VITE_SUPABASE_STORAGE_BUCKET` | Optional override for the Supabase Storage bucket that stores uploaded blog hero images. | `blog-images` |
| `VITE_SUPABASE_APPLICATION_STORAGE_BUCKET` | Optional override for the private Supabase Storage bucket that stores applicant resumes. | `job-applications` |

Store secrets outside of version control (e.g., `.env.local` added to `.gitignore`).

---

## Project Architecture

```
LinQue/
├── public/                 # Static assets (robots, sitemap, OG images)
├── src/
│   ├── assets/             # SVG/bitmap assets for hero art & blog cards
│   ├── components/
│   │   ├── ui/             # shadcn/ui primitives (Button, Card, etc.)
│   │   ├── AnimatedSection.tsx
│   │   ├── LazyImage.tsx
│   │   ├── Layout.tsx (Header + Footer wrapper)
│   │   └── ...
│   ├── data/
│   │   ├── posts.ts        # Blog metadata and article copy
│   │   └── jobs.ts         # Sample job postings
│   ├── hooks/
│   │   ├── useScrollAnimation.tsx
│   │   ├── usePrefersReducedMotion.ts
│   │   └── ...
│   ├── lib/
│   │   ├── seo.ts          # Helpers for canonical URLs
│   │   └── utils.ts        # Tailwind-friendly `cn` helper
│   ├── pages/              # Route components (Home, Services, Jobs, etc.)
│   ├── index.css           # Tailwind base + custom utilities
│   ├── App.tsx             # Router + providers
│   └── main.tsx            # Vite entry point
├── tailwind.config.ts      # Tailwind theme, plugins, animations
├── tsconfig*.json          # TypeScript configs
└── package.json
```

Each major directory also includes a README detailing its purpose and notable files.

---

## Routes & Feature Overview

| Route | Component | Highlights |
|-------|-----------|------------|
| `/` | `pages/Home.tsx` | Hero parallax, animated counters, services tabs, testimonial & logo carousels, gradient CTA. |
| `/about` | `pages/About.tsx` | Company story, leadership modules, timeline animations. |
| `/how-we-work` | `pages/HowWeWork.tsx` | Scroll-linked timeline with IntersectionObserver, principle cards, scheduler CTA. |
| `/services` | `pages/Services.tsx` | Updated service taxonomy, interactive tabs, highlight cards, hero illustration, “Work with us” CTA. |
| `/linque-learn` | `pages/Resources.tsx` | Filterable / paginated blog grid, lazy images, structured data. |
| `/linque-learn/:slug` | `pages/ResourceDetail.tsx` | Rich article detail layout with sticky TOC, share-ready SEO metadata. |
| `/jobs` | `pages/Jobs.tsx` | Filterable job board powered by sample data (`data/jobs.ts`). |
| `/jobs/:slug` | `pages/JobDetail.tsx` | Job detail view with structured data and apply CTA. |
| `/contact` | `pages/Contact.tsx` | Validated contact form that now opens the visitor's mail client with prefilled details, plus scheduler/discovery CTAs. |
| `*` | `pages/NotFound.tsx` | Friendly 404 fallback. |

Routes are registered in `src/App.tsx` using `react-router-dom`.

---

## Key Modules

- **`components/Layout.tsx`** – Global shell with Sticky Header + Footer and a skip link for accessibility.
- **`components/Header.tsx`** – Responsive navigation with scroll-aware compression, CTA buttons, and mobile drawer.
- **`components/AnimatedSection.tsx`** – Reusable wrapper that coordinates IntersectionObserver triggers with Tailwind animation classes, respecting reduced-motion preferences.
- **`components/LazyImage.tsx`** – IntersectionObserver + optional parallax + blur-up placeholder for performance-sensitive imagery.
- **`components/Seo.tsx`** – Thin client-side helper that manages meta tags, Open Graph data, Twitter cards, canonical URLs, and structured data.
- **`hooks/usePrefersReducedMotion.ts`** – Media query helper to adjust animations automatically.
- **`data/posts.ts` / `data/jobs.ts`** – Content sources for the Linque Learn and Jobs sections. Update these to change copy, categories, tags, or job details.

---

## Styling & Design Tokens

- **Tailwind setup** – Located in `tailwind.config.ts`, with custom colors, background gradients, animations (`fade-in-up`, `slide-in-left`, etc.), and typography plugin.
- **Global CSS** – `src/index.css` sets root color tokens, gradients, shadows, base typography, focus states, and the `.skip-link` pattern.
- **Scribble Highlight** – `components/ScribbleHighlight.tsx` provides the signature underline accent.

Use Tailwind utility classes for layout and spacing. Reusable gradients and shadows are defined as CSS variables to maintain consistency across components.

---

## Animation, Performance & Accessibility

- IntersectionObserver powers scroll reveals (`AnimatedSection`) and lazy loading (`LazyImage`).
- `usePrefersReducedMotion` toggles to gentler animations for users with reduced-motion preferences.
- Sticky navigation compresses on scroll without blocking pointer events.
- Skip link (`Layout.tsx`) and focus-visible styling meet keyboard accessibility.
- Contact form includes ARIA validation hints and toast confirmations.
- Lazy-loaded imagery uses a transparent pixel placeholder by default, with optional custom placeholders.

---

## Data & Content Management

- **Headless CMS** – The site can read/write content through Supabase. When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present, blog posts and job listings load from the remote database; otherwise the bundled static data in `src/data/posts.ts` and `src/data/jobs.ts` is used as a fallback.
- **Admin console** – Visit `/admin` to manage posts, jobs, and submitted applications. The dashboard uses Supabase Auth; only authenticated users can create, edit, schedule, and review content and applications. Without Supabase credentials the admin route displays setup instructions.
- **Static SEO assets** – `public/robots.txt` and `public/sitemap.xml` are ready for deployment. Adjust canonical URLs when hosting on a custom domain.

### Supabase schema (minimum viable setup)

Create three core tables in Supabase (`posts`, `jobs`, and `job_applications`) with the columns defined in [supabase/schema.sql](/Users/amadoutoure/Documents/git_projects/linque-website/supabase/schema.sql:1). The current application workflow extends the original CMS schema with:

- `jobs.application_settings` – JSON configuration for the internal application flow, enabled question keys, and placeholder values.
- `job_applications` – Applicant profile data, screening answers, resume metadata, and reviewer notes/status.
- A private `job-applications` Storage bucket for resume uploads.

The `posts` and `jobs` content columns remain the same as before. The new application workflow adds the following resume/application-specific capabilities:

- Direct resume upload from the public job page
- Internal application routing for roles that enable `application_settings.applicationsEnabled`
- Admin-side review status updates (`new`, `in_review`, `shortlisted`, `rejected`, `hired`)
- Resend-backed internal and applicant confirmation emails triggered after each successful submission
- Screening answers stored as JSON so the fixed approved question bank can evolve without a schema rewrite

**`posts`**

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (default uuid_generate_v4) | Primary key |
| `title` | text | Required |
| `slug` | text (unique) | Used for routing |
| `category` | text | Optional |
| `tags` | text[] | Optional |
| `excerpt` | text | Optional |
| `description` | text | SEO description |
| `hero_image` | text | Image URL |
| `read_time_minutes` | int | Defaults to 5 |
| `content` | jsonb | Array of sections (`heading`, `body`, `bullets`) |
| `status` | text | `draft`, `scheduled`, or `published` |
| `published_at` | timestamptz | Optional |
| `created_at` / `updated_at` | timestamptz | Default `now()` |

**`jobs`**

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (default uuid_generate_v4) | Primary key |
| `title` | text | Required |
| `slug` | text (unique) | Used for routing |
| `location` | text | |
| `employment_type` | text | e.g. Full-time |
| `department` | text | |
| `remote_type` | text | Remote/Hybrid/Onsite |
| `summary` | text | |
| `description` | text | |
| `responsibilities` | text[] or jsonb | Array of bullet points |
| `qualifications` | text[] or jsonb | Array of bullet points |
| `salary_range` | text | Optional |
| `apply_email` | text | Optional |
| `apply_url` | text | Optional |
| `application_settings` | jsonb | Internal application toggle, approved question keys, and placeholder values |
| `status` | text | `draft`, `scheduled`, or `published` |
| `posted_at` | timestamptz | Optional |
| `created_at` / `updated_at` | timestamptz | Default `now()` |

**`job_applications`**

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (default uuid_generate_v4) | Primary key |
| `job_id` | uuid | Foreign key to `jobs.id` |
| `job_slug` / `job_title` | text | Snapshot of the job at submission time |
| `full_name`, `email`, `phone`, `address` | text | Required applicant details |
| `desired_pay`, `work_authorization`, `available_start_date`, `highest_education` | text | Required applicant workflow fields |
| `why_interested` | text | Required free-text response |
| `background_check_consent`, `future_role_interest` | boolean | Standard workflow flags |
| `professional_references` | jsonb | Up to three reference objects |
| `screening_answers` | jsonb | Answers from the approved screening question bank |
| `resume_bucket`, `resume_path`, `resume_file_name`, `resume_content_type` | text | Resume storage metadata |
| `review_status` | text | `new`, `in_review`, `shortlisted`, `rejected`, or `hired` |
| `admin_notes` | text | Reviewer notes |
| `notification_status` | text | `pending`, `sent`, `partial`, or `failed` |
| `notification_error` | text | Last delivery error when email sending fails |
| `notification_attempted_at` | timestamptz | Last time the notification workflow ran |
| `internal_notification_sent_at` / `applicant_confirmation_sent_at` | timestamptz | Per-email delivery timestamps |
| `internal_notification_email_id` / `applicant_confirmation_email_id` | text | Resend message ids for support/debugging |
| `created_at` / `updated_at` | timestamptz | Default `now()` |

Enable Row Level Security and create policies that allow:

1. Authenticated users (e.g., members of the “admin” role) to read and write `posts`, `jobs`, and application review fields.
2. Anonymous access to select only published `posts` and `jobs`.
3. Anonymous or authenticated public visitors to insert into `job_applications` only when the target job is published and internal applications are enabled.

### Contact form delivery

By default the contact form opens the visitor's mail client using a prefilled `mailto:` link so their message is sent straight to `info@linqueresourcing.com`. The payload includes the subject, message, name, company, and work email. If you prefer server-side delivery, provide `VITE_CONTACT_ENDPOINT` and restore the API handler in `src/pages/Contact.tsx`.

### Hero image uploads

The admin dashboard now supports uploading hero imagery directly to Supabase Storage so you no longer need to host assets elsewhere. To enable this workflow:

1. Create a **public bucket** named `blog-images` in Supabase Storage (or pick any name and reference it via `VITE_SUPABASE_STORAGE_BUCKET`).
2. Keep the default public read policy enabled or add a custom `storage.objects` select policy scoped to that bucket so the website can render the files.
3. Ensure authenticated users have insert/update permissions on the same bucket so the admin UI can upload files.

Uploaded assets are stored under `posts/{slug}/{timestamp}-{filename}` and the resulting public URL is written to the `hero_image` column automatically.

> Note: uploads must be **JPG or PNG** and smaller than **2 MB**; the admin UI blocks anything outside those limits before sending to Supabase.

### Resume uploads

Applicant resumes are stored in a **private bucket** named `job-applications` by default. To enable the workflow:

1. Create the private bucket or run the SQL in [supabase/schema.sql](/Users/amadoutoure/Documents/git_projects/linque-website/supabase/schema.sql:1) so it is provisioned automatically.
2. Keep the insert policy limited to files uploaded under the `applications/` prefix.
3. Keep download access limited to authenticated reviewers so resumes are never public.

The public application form accepts **PDF**, **DOC**, and **DOCX** files up to **5 MB**.

### Application email delivery

Application notifications are delivered by the Supabase Edge Function in [supabase/functions/job-application-notifications/index.ts](/Users/amadoutoure/Documents/git_projects/linque-website/supabase/functions/job-application-notifications/index.ts:1). The flow is:

1. A candidate submits the internal application form.
2. The application row is inserted into `job_applications`.
3. A Postgres trigger uses `pg_net` to call the Edge Function.
4. The function sends:
   - an internal notification to `jobs.apply_email` or `APPLICATION_DEFAULT_NOTIFICATION_EMAIL`
   - a confirmation email to the applicant
5. The function writes the delivery result back onto the application row.

To enable this in a real environment, set these Edge Function secrets in Supabase:

- `RESEND_API_KEY` – API key from Resend
- `RESEND_FROM_EMAIL` – verified sender such as `Linque Resourcing <careers@mail.linqueresourcing.com>`
- `JOB_APPLICATION_WEBHOOK_SECRET` – shared secret used by the database trigger and the Edge Function
- `APPLICATION_DEFAULT_NOTIFICATION_EMAIL` – fallback internal inbox when a job record does not define `apply_email`
- `APPLICATION_ADMIN_URL` – optional override for the admin dashboard URL; defaults to `https://linqueresourcing.com/admin`

The database trigger also expects these keys in the private `application_integration_settings` table:

- `job_application_notifications_url` – full Edge Function URL, e.g. `https://<project-ref>.supabase.co/functions/v1/job-application-notifications`
- `job_application_webhook_secret` – same value as `JOB_APPLICATION_WEBHOOK_SECRET`

---

## Build, Lint & Deployment

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR. |
| `npm run build` | Build optimized production bundle (output in `dist/`). |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run ESLint with TypeScript rules. Uses the default shadcn lint config (Fast Refresh warnings are expected for certain shared UI modules). |

### Deployment

The generated `dist/` folder is static and can be uploaded to:

- Vercel / Netlify / Cloudflare Pages
- AWS S3 + CloudFront
- Azure Static Web Apps
- Any generic static file host

If you still publish from Lovable, you can continue to do so—this repository is fully independent of that workflow.

---

## Troubleshooting

- **Dev server fails to start** – Confirm Node.js ≥ 18: `node -v`. Delete `node_modules` and reinstall if dependencies look corrupted.
- **Environment variables missing** – Create `.env.local` with your overrides (`VITE_SCHEDULER_URL`, API endpoints, etc.).
- **Contact form errors** – Ensure `VITE_CONTACT_ENDPOINT` points to a valid CORS-enabled POST endpoint or leave unset for simulated responses while designing.
- **Lint warnings** – `react-refresh/only-export-components` warnings stem from shadcn/ui shared exports and can be safely ignored unless you plan to refactor those modules.

With this overview, any developer can jump in, find the relevant component or data source, and ship updates confidently. Happy building! 🚀
