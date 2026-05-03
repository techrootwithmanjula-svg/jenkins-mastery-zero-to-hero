# `src/modules/nanny` — Admin nanny management

## Purpose

CRUD for nanny profiles onboarded and maintained by **admins** only.

## HTTP surface (mounted at `/api/admin/nannies`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Create nanny (requires `user_id` → active `users` row) |
| GET | `/` | Paginated list + filters + optional `mobile` search on `mobile_number` |
| GET | `/:id` | Get one nanny |
| PATCH / PUT | `/:id` | Update nanny (partial via shared validation rules) |
| DELETE | `/:id` | Soft delete (`is_active = false`) |

## Security

- Parent mount in `src/routes/index.js`: `authMiddleware` + `roleMiddleware(roles.ADMIN)`.
- JWT must include `role: "admin"`.

## Data model (API ↔ DB)

- **`user_id`**: required on create; must reference an **active** user.
- API uses **`experience`** (years, number). DB column: **`experience_years`** (`NUMERIC(6,2)`).
- **`certificates`**: array of URL strings; stored as `JSONB`.
- **`aadhar_number`**: 12 digits (spaces stripped in service).
- **`pan_card`**: normalized uppercase PAN.

## Validation highlights

- Required on create: `user_id`, `first_name`, `last_name`, `dob`, `mobile_number`, `email_id`, `gender`, `experience`, `aadhar_number`, `pan_card`.
- Uniqueness: `mobile_number`, `email_id`, `aadhar_number`, `pan_card` — DB unique constraints; service maps `23505` to **409** with specific messages.

## List query parameters

- `page` (default 1), `limit` (default 10, max 100)
- `is_active`: `true` | `false` (omit for all)
- `gender`: `male` | `female` | `other`
- `experience_min`, `experience_max`: numeric range (service validates `min <= max`)
- `mobile`: partial case-insensitive match on `mobile_number`

## Future reference

- Add audit log table for admin changes to sensitive fields.
- Consider masking Aadhar/PAN in list responses if policy changes.
- Align app login role `nanny` with `nannies.user_id` if you add self-service profile edits later.
