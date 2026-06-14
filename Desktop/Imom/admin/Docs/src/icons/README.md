# src/icons/

SVG icon library for the project. All icons are exported as React components from the barrel file `index.ts`.

## Structure

```
icons/
├── index.ts          ← Barrel export — import all icons from here
└── *.svg             ← Raw SVG files (consumed via vite-plugin-svgr)
```

## Usage

Always import from the barrel, not individual files:

```tsx
import { GridIcon, ChevronDownIcon, HorizontaLDots } from "../icons";
```

## Currently Used Icons

| Export | Used In |
|---|---|
| `GridIcon` | `AppSidebar` nav items |
| `ChevronDownIcon` | `AppSidebar` submenu toggle |
| `HorizontaLDots` | `AppSidebar` collapsed menu label |

## Adding a New Icon

1. Drop the `.svg` file into `src/icons/`
2. Export a named component from `index.ts`:
   ```ts
   export { ReactComponent as MyIcon } from "./my-icon.svg";
   ```
   (Requires `vite-plugin-svgr` which is already installed.)
