# `src/modules/baby` — Baby record management

## Purpose

Manages baby records belonging to a parent profile. Baby deletion is the only isolated operation.

## Endpoints (mounted at `/api/babies`, requires `authMiddleware`)

| Method | Path | Behavior |
|--------|------|----------|
| DELETE | `/api/babies/:id` | Deletes baby only if `parent.user_id` matches token `user_id` |

## Create / Update

Baby creation and update happen through `PUT /api/profile` or `PATCH /api/profile` in the `parent` module.

## Security

- Ownership check: `babies.parent_id` → `parents.user_id` must equal `req.user.id`.
- Returns **403** if baby exists but belongs to another user.
- Returns **404** if baby does not exist.

## Future reference

- If product grows, move baby CRUD to its own isolated service and route prefix.
