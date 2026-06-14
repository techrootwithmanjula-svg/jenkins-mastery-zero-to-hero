# src/components/UserProfile/

Sub-components that together render a complete user profile view. Consumed by `src/pages/UserProfiles.tsx`.

## Files

| File | Renders |
|---|---|
| `UserMetaCard.tsx` | Profile avatar, name, role, and social links at the top of the profile |
| `UserInfoCard.tsx` | Personal details panel (email, phone, location, etc.) |
| `UserAddressCard.tsx` | Address and location card |

## Data Source

Currently these components render static/mock data. To connect to a real API:
1. Fetch user data in `UserProfiles.tsx` using a `useEffect` + the `api` client
2. Pass the data down as props to each card component

## Notes

- User meta data (name, avatar) is also stored in `localStorage` under the `user` key during sign-in, so it can be used without an extra API call for basic display purposes.
