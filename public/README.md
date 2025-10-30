# public directory

Static files copied verbatim to the final build. Use this folder for assets that must remain at predictable URLs without being fingerprinted by Vite.

## Contents

| File | Purpose |
|------|---------|
| `favicon.svg` / `favicon.ico` | Browser and device icons. |
| `robots.txt` | Search engine crawl directives. Update when hosting environment changes. |
| `sitemap.xml` | XML sitemap for SEO submission. Regenerate when routes change. |

Place additional static assets (for example, `.well-known` verification files) here when required. Avoid storing large media; prefer importing into `src/assets` so Vite can optimise and fingerprint them.
