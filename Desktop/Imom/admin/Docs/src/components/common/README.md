# src/components/common/

Shared utility components used across multiple pages and layouts. Not domain-specific.

## Key Components

| Component | Purpose |
|---|---|
| `ScrollToTop` | Listens to route changes and scrolls `window` to `(0, 0)` — mounted once in `App.tsx` |
| `ThemeToggleButton` | Button that toggles between light and dark mode via `ThemeContext` |
| `GridShape` | Decorative SVG grid pattern used on the auth layout background |
| `PageBreadCrumb` | Renders a breadcrumb bar at the top of page content |

## Usage Notes

- `ScrollToTop` must be placed inside `<Router>` but outside `<Routes>` to fire on every navigation.
- `ThemeToggleButton` reads/writes the `ThemeContext` — ensure `ThemeProvider` wraps the tree above it.
