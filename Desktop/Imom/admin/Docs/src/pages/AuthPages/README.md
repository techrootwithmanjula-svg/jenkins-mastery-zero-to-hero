# src/pages/AuthPages/

Authentication page components. These pages render **outside** `AppLayout` — no sidebar or header.

## Files

### `AuthPageLayout.tsx`
Two-column layout wrapper used by auth pages.

| Column | Content |
|---|---|
| Left (full width on mobile, 50% on desktop) | `children` — the actual form |
| Right (hidden on mobile, 50% on desktop) | Brand panel with `GridShape` decoration and logo |

Props: `{ children: React.ReactNode }`

### `SignIn.tsx`
The `/signin` route page. Wraps `<AuthPageLayout>` around `<SignInForm />`. This is a thin page component — all sign-in logic lives in `SignInForm`.

## Access Control

Both files are wrapped by `<PublicRoute />` in `App.tsx`, meaning:
- Logged-in users who navigate to `/signin` are **automatically redirected to `/`**
- Only unauthenticated users can reach these pages
