# Auth Module Knowledge

## API Endpoints

- `POST /api/auth/send-otp`: validates mobile, invalidates older OTPs, creates a fresh hashed OTP.
- `POST /api/auth/verify-otp`: validates OTP, enforces attempt limits, creates user (if missing), returns JWT + user.
- `POST /api/auth/resend-otp`: enforces cooldown and resend limits, invalidates old OTP, creates a new OTP.

## OTP Login Flow

1. Client calls `POST /api/auth/send-otp` with a valid mobile number.
2. Service generates a 6-digit OTP, hashes it with bcrypt, invalidates previous active OTPs, and stores only hash + expiry.
3. Client calls `POST /api/auth/verify-otp`.
4. Service validates attempts, expiry, and hash match.
5. On success, OTP is marked used, user is created (if missing), and JWT is returned with user details.

## Resend Logic

- Resend is available through `POST /api/auth/resend-otp`.
- Cooldown is enforced using `OTP_RESEND_COOLDOWN`.
- Resend limit is enforced using `OTP_RESEND_LIMIT`.
- Every resend invalidates previous active OTP and creates a new OTP record with incremented `resend_count`.

## JWT Usage

- JWT is generated after successful OTP verification.
- Token payload includes `id`, `mobile`, and `role`.
- Expiry is controlled via `JWT_EXPIRES_IN`.
- Signature uses `JWT_SECRET` from environment.
- If `JWT_SECRET` is missing, token generation fails by design.

## Role Handling

- User roles follow enum values: `user`, `nanny`, `admin`.
- New users created during OTP verification are assigned default role `user`.
- `auth.middleware` verifies JWT and injects `req.user`.
- `role.middleware` enforces RBAC per route.
