# src/components

This directory houses reusable UI elements. It is split into layout shells, animation helpers, and the shadcn/ui primitive layer that underpins the design system.

## Key files

| File | Description |
|------|-------------|
| `Layout.tsx` | Wraps every page with the header, footer, skip link, and main content region. |
| `Header.tsx` | Sticky navigation bar with responsive menu, CTA buttons, and branded logo. |
| `Footer.tsx` | Footer with navigation shortcuts, contact details, and social links. |
| `AnimatedSection.tsx` | IntersectionObserver-powered wrapper that triggers reveal animations. |
| `LazyImage.tsx` | Utility for lazy loading images with optional parallax and blur-up placeholders. |
| `ScribbleHighlight.tsx` | Component that renders the signature highlight underline effect. |

## Subdirectories

| Folder | Contents |
|--------|----------|
| `ui/` | Generated shadcn/ui primitives (Button, Card, Toaster, Dialog, etc.). These files are mostly pass-through wrappers around Radix and Tailwind classes. Avoid editing generated files unless you are familiar with the shadcn update workflow. |

When adding new shared components, follow the established pattern of colocating component-specific assets next to the component or in `src/assets` if reused elsewhere. Document new components here so future contributors can discover them quickly.*** End Patch
