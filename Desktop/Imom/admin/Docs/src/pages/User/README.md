# src/pages/User/

User management page rendered at `/users`.

## Files

### `User.tsx`
Displays a data table of users using `BasicTableOne` from `src/components/tables/BasicTables/`.

**Current state:** Shows mock/static table data via `BasicTableOne`. To connect to the real API:
1. Add a `useEffect` that calls the relevant user-list endpoint via `src/services/api.tsx`
2. Pass the fetched data as props to `BasicTableOne`

## Access Control

Protected route — requires a valid token. Unauthenticated access redirects to `/signin`.
