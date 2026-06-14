# src/

Root of all application source code.

## Files

| File | Purpose |
|---|---|
| `App.tsx` | Root component — router setup with protected/public route guards |
| `main.tsx` | Vite entry point — mounts `<App />` with global providers |
| `index.css` | Global CSS and Tailwind base imports |
| `svg.d.ts` | TypeScript declaration for `*.svg` imports |
| `vite-env.d.ts` | Vite environment type declarations |

## Subfolders

| Folder | Responsibility |
|---|---|
| `components/` | Reusable UI and feature components |
| `context/` | React context providers (sidebar, theme) |
| `hooks/` | Custom React hooks |
| `icons/` | SVG icon components |
| `layout/` | Page shell components (sidebar, header, wrapper) |
| `pages/` | Route-level page components |
| `services/` | API calls and HTTP client setup |
| `utils/` | Stateless utility helpers |
