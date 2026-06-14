# src/utils/

Stateless utility helpers. No React dependencies — plain TypeScript modules.

## `tokenManager.ts`

Centralised interface for reading and writing the JWT access token in `localStorage`.

**Storage key:** `"accessToken"`

### API

| Method | Signature | Description |
|---|---|---|
| `getToken()` | `() => string \| null` | Reads the token from `localStorage` |
| `setToken(token)` | `(token: string) => void` | Writes the token to `localStorage` |
| `removeToken()` | `() => void` | Deletes the token from `localStorage` |
| `isLoggedIn()` | `() => boolean` | Returns `true` if a token key exists |

### Usage

```ts
import { tokenManager } from "../utils/tokenManager";

// After successful login
tokenManager.setToken(response.token);

// Check before rendering a protected page
if (!tokenManager.isLoggedIn()) navigate("/signin");

// On logout
tokenManager.removeToken();
```

### Notes

- `isLoggedIn()` only checks for **presence** of the key, not token validity. Expired tokens are caught by the API 401 interceptor in `src/services/api.tsx`.
- All four methods are properties of a single exported `tokenManager` object (not individual named exports) to make mocking in tests easier.
