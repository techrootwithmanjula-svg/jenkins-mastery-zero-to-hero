# src/App.tsx

Root application component. Owns the entire React Router tree.

## Responsibilities

- Wraps the app in `BrowserRouter`
- Mounts `<ScrollToTop />` so the page scrolls to top on route change
- Declares all routes split into three tiers: public, protected, and catch-all

## Route Tiers

### Public routes (`<PublicRoute />` wrapper)
Accessible **only when the user is NOT logged in**. Visiting while logged in redirects to `/`.

| Path | Component |
|---|---|
| `/signin` | `SignIn` |

### Protected routes (`<ProtectedRoute />` wrapper)
Accessible **only when the user IS logged in**. Visiting while not logged in redirects to `/signin`, preserving the intended destination in `location.state.from`.

All protected routes render inside `<AppLayout />` which provides the sidebar + header shell.

| Path | Component |
|---|---|
| `/` | `Home` (dashboard) |
| `/users` | `User` (user management table) |
| `/profile` | `UserProfiles` |
| `/blank` | `Blank` (template page) |

### Catch-all
Any unmatched path redirects to `/` (which itself will be further redirected to `/signin` if not logged in).

## Imports

| Symbol | Source |
|---|---|
| `ProtectedRoute` | `./components/auth/ProtectedRoute` |
| `PublicRoute` | `./components/auth/PublicRoute` |
| `AppLayout` | `./layout/AppLayout` |
| `ScrollToTop` | `./components/common/ScrollToTop` |

## Edge Cases Handled

| Scenario | Behaviour |
|---|---|
| Not logged in, visits `/` | `ProtectedRoute` → redirect `/signin` |
| Not logged in, visits any protected path | `ProtectedRoute` → redirect `/signin` |
| Logged in, visits `/signin` | `PublicRoute` → redirect `/` |
| Visits unknown path | `Navigate to="/"` → resolved by the above rules |
| Token expires mid-session | Axios 401 interceptor clears token, hard-redirects `/signin` |
