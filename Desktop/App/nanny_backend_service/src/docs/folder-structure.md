# Folder Structure Knowledge

## Purpose of Main Folders

- `src/config`: environment and infrastructure clients (PostgreSQL, Redis).
- `src/core`: shared cross-cutting concerns (middleware, utils, constants, exceptions).
- `src/modules`: feature modules that contain controller, service, and repository layers.
- `src/routes`: central route aggregation.
- `src/db`: migration and seed assets.
- `src/docs`: technical documentation and Swagger specs.
- `src/docs/knowledge`: focused implementation knowledge files (for config and module behavior).

## Knowledge Mirror Convention

- `src/docs/knowledge` now mirrors `src` domains for future reference:
  - `app.md`, `server.md`
  - `config/*`
  - `core/*`
  - `modules/*` (e.g. `auth`, `nanny`)
  - `routes.md`
  - `db.md`
  - `docs.md`

## Why Modular Monolith

- Keeps features isolated by module while staying in one deployable unit.
- Reduces coupling through clean layer boundaries (controller -> service -> repository).
- Makes future microservice extraction straightforward because each module already has clear ownership and interfaces.
- Enables production maintainability by keeping shared concerns centralized in `core`.
