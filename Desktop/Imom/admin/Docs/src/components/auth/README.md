# src/components/auth/

Authentication-related components: the sign-in form and the two route guard wrappers.

## Files

### `SignInForm.tsx`
Two-step OTP sign-in form.

**Step 1 — Mobile input:**
- User enters their mobile number and clicks "Send OTP"
- Calls `sendOtpService(mobile)` → sets `otpSent = true` on success

**Step 2 — OTP input:**
- User enters the OTP received via SMS
- Calls `verifyOtpService(mobile, otp)`
- On success: stores token via `tokenManager.setToken()`, stores user object in `localStorage`, navigates to `/`
- On failure: shows `alert(response.message)`
- "Resend OTP" button calls `resendOtpService(mobile)`
- "Back" button resets to step 1

**State:**

| State | Type | Purpose |
|---|---|---|
| `mobile` | `string` | Phone number input value |
| `otp` | `string` | OTP input value |
| `otpSent` | `boolean` | Controls which step is shown |
| `loading` | `boolean` | Disables buttons during async calls |

---

### `ProtectedRoute.tsx`
Route guard for authenticated pages.

- Checks `tokenManager.isLoggedIn()` (presence of `accessToken` in `localStorage`)
- If **not** logged in → `<Navigate to="/signin" state={{ from: location }} replace />`
- If logged in → renders `<Outlet />` (child routes)
- Passes the current `location` in `state.from` so the sign-in page can redirect back after login if needed

---

### `PublicRoute.tsx`
Route guard for public-only pages (currently `/signin`).

- Checks `tokenManager.isLoggedIn()`
- If **logged in** → `<Navigate to="/" replace />`
- If not logged in → renders `<Outlet />` (child routes)

## Auth Flow

```
/signin visited
    │
    ├─ Logged in? ──Yes──▶ Redirect /
    │
    └─ No ──▶ Show SignInForm
                  │
                  ├─ Send OTP (mobile)
                  └─ Verify OTP (mobile + otp)
                          │
                          └─ Success ──▶ Save token + user ──▶ Navigate /
```
