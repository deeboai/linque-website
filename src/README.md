# src directory

The `src/` tree contains all TypeScript and styling sources for the Linque Resourcing site. The project is organised by concern, with shared utilities separated from content data and route components.

## Top-level structure

| Path | Purpose |
|------|---------|
| `assets/` | Optimised media and SVG artwork referenced by components. |
| `components/` | Reusable UI building blocks and layout primitives. |
| `data/` | Local content fallbacks (blog posts, job listings) used when Supabase is unavailable. |
| `hooks/` | Custom React hooks for animation, reduced-motion detection, and data access. |
| `lib/` | Framework-agnostic utilities such as SEO helpers and Tailwind class combiners. |
| `pages/` | Route components mapped by `react-router-dom` in `App.tsx`. |
| `App.tsx` | Root router, providers, and layout wrapper. |
| `index.css` | Tailwind base layer plus design tokens, gradients, and custom utilities. |
| `main.tsx` | Vite bootstrap that mounts the React application. |

Refer to the README in each subdirectory for additional detail about the files inside.*** End Patch*** End Patch
