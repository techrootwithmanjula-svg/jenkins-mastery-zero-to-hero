# `src/modules/user` — Admin user management

## Purpose

CRUD for `users` rows, **admin-only**, mounted at `/api/admin/users`.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Create user |
| GET | `/` | Paginated list; query `mobile` for partial search on `users.mobile` |
| GET | `/:id` | Get by id (includes inactive) |
| PATCH / PUT | `/:id` | Update fields |
| DELETE | `/:id` | Soft delete: `is_active = false` and **DELETE** all `nannies` with that `user_id` |

## Behaviour notes

- **OTP login** (`findUserByMobile`) only matches **`is_active = TRUE`** users.
- New users created via OTP continue to insert `is_active = TRUE` in `auth.repository`.
- **Unique mobile** enforced at DB level; conflicts return **409**.
- **Soft delete + nannies**: implemented in a **transaction** in `user.repository.softDeleteAndRemoveNannies` so nanny rows are removed when the user is deactivated.

## Future reference

- Add profile fields (name, email) on `users` if product needs them at account level.
- Consider audit log for admin changes to `role` and `is_active`.
