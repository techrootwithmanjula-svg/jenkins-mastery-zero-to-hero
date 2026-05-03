# `src/db`

## Purpose

Database evolution assets (migrations and optional seeders).

## Current Assets

- `migrations/001_create_users_and_otp.sql`
  - creates `user_role` enum
  - creates `users` table
  - creates `otp` table
  - adds lookup indexes for auth flow

- `migrations/002_create_nannies.sql`
  - creates `nanny_gender` enum
  - creates `nannies` table with unique constraints and list indexes

- `migrations/003_users_is_active_and_nannies_user_id.sql`
  - adds `users.is_active` for soft delete / deactivation
  - adds `nannies.user_id` → `users(id)` with `ON DELETE CASCADE` and unique index per user

- `migrations/004_create_parents_and_babies.sql`
  - creates `parent_gender` and `baby_gender` enums
  - creates `parents` table (1:1 with `users` via unique `user_id`)
  - creates `babies` table (1:N under `parents`) with `ON DELETE CASCADE` on `parent_id`

## Future Reference

- Add new migration files incrementally and never rewrite applied migrations.
