# `src/modules/parent` — User profile management

## Purpose

Manages the `parents` table (1:1 with `users`) and orchestrates baby upserts in `profile.service.js`.

## Endpoints (mounted at `/api/profile`, requires `authMiddleware`)

| Method | Path | Behavior |
|--------|------|----------|
| GET | `/api/profile` | Returns parent + all babies for the token user |
| PUT | `/api/profile` | Full upsert — `parent.name` required; replaces all provided parent fields |
| PATCH | `/api/profile` | Partial upsert — updates only provided parent fields |

## Baby handling in PUT/PATCH

- Field `babies` absent or empty array → **no change** to babies.
- Baby object with `id` → **update** that baby (ownership verified against `parent_id`).
- Baby object without `id` → **create** new baby linked to the parent.
- **Deletion is NOT performed here** — use `DELETE /api/babies/:id`.

## Security

- `user_id` is always read from `req.user.id` (JWT token), **never from request body**.
- Ownership verified: baby's `parent_id` must match the user's parent row.

## Validation highlights

- `parent.name` required when creating (first PUT/PATCH).
- `parent.email` must be valid format if provided.
- `parent.emergency_contact_number` numeric (10–15 digits).
- `baby.dob` cannot be a future date.

## Future reference

- Add profile photo upload handling (S3 presigned URL flow).
- Consider caching GET profile response per `user_id`.
