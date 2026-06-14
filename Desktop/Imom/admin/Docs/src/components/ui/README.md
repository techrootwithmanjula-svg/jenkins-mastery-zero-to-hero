# src/components/ui/

Design-system primitives. These are the lowest-level visual building blocks used throughout the app.

## Components

| Folder/File | Component | Purpose |
|---|---|---|
| `alert/` | `Alert` | Coloured status banners (info, success, warning, error) |
| `avatar/` | `Avatar` | Circular user image with fallback initials |
| `badge/` | `Badge` | Small pill label for counts or status tags |
| `button/Button.tsx` | `Button` | Primary action button with size and variant props |
| `dropdown/` | `Dropdown` | Generic dropdown menu with trigger + items |
| `images/` | `Images` | Standardised `<img>` wrappers |
| `modal/` | `Modal` | Accessible overlay dialog (focus trap + backdrop) |
| `table/` | `Table` | Styled HTML table shell components |
| `videos/` | `Videos` | Video embed helpers |

## `Button` Props

| Prop | Values | Default |
|---|---|---|
| `variant` | `"solid"` \| `"outline"` | `"solid"` |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` |
| `disabled` | `boolean` | `false` |
| `className` | `string` | — |

## Conventions

- All components forward `className` so callers can override or extend styles using `tailwind-merge` / `clsx`.
- No business logic lives in `ui/` — these are pure presentational components.
