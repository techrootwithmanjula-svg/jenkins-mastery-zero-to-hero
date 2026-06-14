# src/pages/

Route-level page components. Each file maps 1-to-1 with a route defined in `App.tsx`.

## Structure

```
pages/
├── AuthPages/
│   ├── AuthPageLayout.tsx   ← Two-column layout wrapper for auth pages
│   └── SignIn.tsx           ← /signin route page
├── Dashboard/
│   └── Home.tsx             ← / route (dashboard home)
├── User/
│   └── User.tsx             ← /users route
├── UserProfiles.tsx         ← /profile route
└── Blank.tsx                ← /blank route (template/placeholder)
```

## Conventions

- Page components are thin — they compose components from `src/components/` and pass data down.
- Data fetching (API calls) should live in the page component (via `useEffect`) and be passed as props to children.
- Pages inside `AppLayout` automatically receive the sidebar + header shell.

## Route Map

| Route | Page | Layout |
|---|---|---|
| `/signin` | `SignIn` | `AuthPageLayout` (no sidebar) |
| `/` | `Home` | `AppLayout` |
| `/users` | `User` | `AppLayout` |
| `/profile` | `UserProfiles` | `AppLayout` |
| `/blank` | `Blank` | `AppLayout` |
