# src/components/header/

Components rendered inside `AppHeader` that are specific to the top navigation bar.

## Files

### `NotificationDropdown.tsx`
Bell-icon dropdown that shows a list of recent notifications. Manages its own open/close state.

### `UserDropdown.tsx`
Avatar + name dropdown in the top-right corner. Provides:
- Link to the user's profile page (`/profile`)
- Sign-out action — should clear `tokenManager` token and redirect to `/signin`

## Notes

- Both dropdowns use a click-outside listener to close automatically.
- `UserDropdown` reads user data from `localStorage` (`user` key set during sign-in).
