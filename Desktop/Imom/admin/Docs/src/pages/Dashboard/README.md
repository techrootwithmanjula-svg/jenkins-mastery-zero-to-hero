# src/pages/Dashboard/

Dashboard home page rendered at the `/` route.

## Files

### `Home.tsx`
Main landing page after login. Currently renders the dashboard overview with:
- Ecommerce widgets (from `src/components/ecommerce/`)
- Metric cards and charts

## Notes

- This is the default redirect destination after a successful sign-in (`navigate("/")` in `SignInForm`).
- It is protected — unauthenticated users are redirected to `/signin` before this page ever mounts.
