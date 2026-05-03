# Database Design

## `users` Table

- `id`: primary key (`BIGSERIAL`).
- `mobile`: unique login identifier.
- `role`: enum (`user`, `nanny`, `admin`) for RBAC.
- `is_verified`: marks OTP-verified users.
- `is_active`: soft-delete / deactivation flag (`TRUE` by default). OTP login only resolves **active** users.
- `created_at`, `updated_at`: audit timestamps.

## `otp` Table

- `id`: primary key (`BIGSERIAL`).
- `mobile`: reference key for OTP operations.
- `otp_hash`: bcrypt hash of OTP (plain OTP is never stored).
- `expires_at`: absolute expiry timestamp.
- `is_used`: prevents OTP replay.
- `attempts`: counts failed verification attempts.
- `resend_count`: tracks resend quota usage.
- `created_at`: used for latest-OTP and cooldown calculation.

## Relationship and Decisions

- OTP records are linked by `mobile` instead of `user_id` to allow login before user exists.
- Latest OTP governs verification and resend decisions.
- Old OTPs are invalidated during send/resend to keep only one active OTP path.
- Additional indexes on `otp(mobile)` and `otp(mobile, created_at desc)` improve lookup performance.

## `nannies` Table (admin-managed profiles)

- `id`: primary key (`BIGSERIAL`).
- `user_id`: foreign key → `users.id` (**required** for new records via API). `ON DELETE CASCADE` removes nanny rows if a user row is **hard-deleted**. Admin **soft-delete** of a user also removes nanny rows in application logic.
- `first_name`, `middle_name`, `last_name`: name fields (`middle_name` optional).
- `dob`: date of birth (`DATE`).
- `image`: profile image URL (`TEXT`, optional).
- `mobile_number`, `email_id`: unique identifiers for contact.
- `gender`: enum `nanny_gender` (`male`, `female`, `other`).
- `address`, `permanent_address`, `emergency_contact`: location and emergency info.
- `certificates`: `JSONB` array of certificate URLs (default `[]`).
- `experience_years`: numeric years of experience (`NUMERIC(6,2)`); API field is `experience`.
- `aadhar_number`, `pan_card`: unique government IDs (sensitive; admin-only access).
- `is_active`: soft-delete flag (default `TRUE`; delete sets `FALSE`).
- `created_at`, `updated_at`: audit timestamps (`updated_at` refreshed on update).

- Add `parents` and `babies` tables to db-design doc

## `parents` Table

- `id`: primary key.
- `user_id`: FK → `users.id`, unique (one profile per user).
- `name`: required.
- `dob`, `address`, `permanent_address`, `emergency_contact_number`, `email`, `gender`: optional contact/personal fields.
- `mother_name`, `father_name`, `mother_occupation`, `father_occupation`: family details.
- `image_url`: profile photo URL.
- `created_at`, `updated_at`: audit timestamps.

## `babies` Table

- `id`: primary key.
- `parent_id`: FK → `parents.id` with `ON DELETE CASCADE`.
- `name`: required.
- `dob`: validated for no future dates.
- `gender`, `image_url`, `any_period_disease`, `note`: optional fields.
- `created_at`, `updated_at`: audit timestamps.
