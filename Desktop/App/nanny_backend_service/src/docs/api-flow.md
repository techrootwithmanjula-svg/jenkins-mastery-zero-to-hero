# API Request Lifecycle

1. Request enters Express app through `src/app.js`.
2. Base middleware runs (`helmet`, JSON parser, logging).
3. Swagger docs are exposed at `/api-docs` for API contracts.
4. Route is resolved via `src/routes/index.js` under `/api` (e.g. `/api/auth`, `/api/admin/nannies`).
5. Module route applies request validation rules.
6. `validation.middleware` rejects malformed payloads.
7. Controller receives validated request and delegates to service only.
8. Service executes OTP/JWT business rules and orchestration.
9. Service calls repository for persistence and data lookup.
10. Repository executes PostgreSQL queries through `src/config/database.config.js`.
11. Service returns result to controller.
12. Controller formats response through response utility.
13. Any thrown error is handled by central `error.middleware`.
