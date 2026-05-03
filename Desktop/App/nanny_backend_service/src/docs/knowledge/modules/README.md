# `src/modules`

Feature-first domain organization.

Each module should own:

- controller (transport layer)
- service (business rules)
- repository (data access)
- routes (HTTP mapping)
- validation (request schema/rules)

This structure keeps migration to microservices straightforward.

## Current modules

- `auth`: OTP login and JWT issuance.
- `user`: Admin-only CRUD for platform users (`/api/admin/users`).
- `nanny`: Admin-only CRUD for nanny profiles (`/api/admin/nannies`).
- `parent`: Authenticated user — profile upsert (`/api/profile`). Orchestrates baby create/update.
- `baby`: Authenticated user — baby delete (`/api/babies/:id`).
