# Nanny Backend Service

Production-ready Node.js backend scaffold using Express.js and PostgreSQL, implemented as a modular monolith with Clean Architecture.

## Quick Start

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL`, `JWT_SECRET`, and other environment values.
3. Install dependencies:
   - `npm install`
4. Run server:
   - `npm run dev`

## Auth APIs

- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/resend-otp`

## Admin — User management (JWT + role `admin`)

- `POST /api/admin/users` — create user (`mobile`, optional `role`, `is_verified`, `is_active`)
- `GET /api/admin/users` — list with `page`, `limit`, `is_active`, `mobile` (partial search)
- `GET /api/admin/users/:id` — get user
- `PATCH` / `PUT /api/admin/users/:id` — update user
- `DELETE /api/admin/users/:id` — soft delete user (`is_active = false`) and **delete** linked rows in `nannies` for that `user_id`

## Admin — Nanny management (JWT + role `admin`)

All routes require `Authorization: Bearer <token>` with `role: admin`.

For local testing, set a user’s `role` to `admin` in the `users` table (OTP login defaults to `user`).

- `POST /api/admin/nannies` — create nanny (**requires `user_id`** linking to an active `users` row)
- `GET /api/admin/nannies` — list with `page`, `limit`, `is_active`, `gender`, `experience_min`, `experience_max`, **`mobile`** (search on `mobile_number`)
- `GET /api/admin/nannies/:id` — get by id
- `PATCH /api/admin/nannies/:id` or `PUT /api/admin/nannies/:id` — update
- `DELETE /api/admin/nannies/:id` — soft delete (`is_active = false`)

## User-facing APIs (JWT required)

- `GET /api/profile` — get own parent + babies
- `PUT /api/profile` — full upsert parent + babies
- `PATCH /api/profile` — partial upsert parent + babies
- `DELETE /api/babies/:id` — delete own baby record

- `GET /api-docs`

## Database

Run SQL migration:

- `src/db/migrations/001_create_users_and_otp.sql`
- `migrations/002_create_nannies.sql`
- `migrations/003_users_is_active_and_nannies_user_id.sql`
- `migrations/004_create_parents_and_babies.sql`
