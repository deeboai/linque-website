# src/hooks

Custom React hooks that encapsulate reusable behaviour live here. They abstract browser APIs and shared logic so components remain declarative.

## Hooks

| Hook | Purpose |
|------|---------|
| `useScrollAnimation.tsx` | Observes elements entering the viewport and toggles animation classes. |
| `usePrefersReducedMotion.ts` | Reads the user’s `prefers-reduced-motion` setting and exposes a boolean. |
| `useContent.ts` | Fetches Linque Learn posts and job listings from Supabase, with static fallbacks. |

When introducing a new hook, prefer naming it `useThing` and colocate related types within the file. Document the hook here so downstream teams know it exists.*** End Patch
