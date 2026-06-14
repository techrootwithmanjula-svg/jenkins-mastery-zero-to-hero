# public/

Static assets served directly at the root URL path. Files here are **not** processed by Vite — they are copied as-is to the build output.

## Structure

```
public/
├── favicon.png
└── images/
    ├── logo/
    │   ├── logo.svg          ← Light mode full logo
    │   ├── logo-dark.svg     ← Dark mode full logo
    │   ├── logo-icon.svg     ← Collapsed sidebar icon
    │   └── auth-logo.svg     ← Logo shown on the auth page right panel
    ├── brand/
    ├── cards/
    ├── carousel/
    ├── chat/
    ├── country/
    ├── error/
    ├── grid-image/
    ├── icons/
    ├── product/
    ├── shape/
    ├── task/
    ├── user/
    └── video-thumb/
```

## Referencing Assets

Reference files with an absolute path from root:

```tsx
<img src="/images/logo/logo.svg" alt="Logo" />
```

In `AppHeader.tsx` the logo uses a relative path (`./images/logo/logo.svg`) — this works in most cases but the absolute path (`/images/logo/logo.svg`) is preferred to avoid issues with nested routes.

## Logo Usage

| Context | File |
|---|---|
| Sidebar (expanded, light) | `/images/logo/logo.svg` |
| Sidebar (expanded, dark) | `/images/logo/logo-dark.svg` |
| Sidebar (collapsed) | `/images/logo/logo-icon.svg` |
| Auth page panel | `/images/logo/auth-logo.svg` |
