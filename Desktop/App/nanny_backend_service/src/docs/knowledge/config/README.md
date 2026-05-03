# `src/config`

Infrastructure configuration layer.

- `env.config.js`: central environment parsing and defaults.
- `database.config.js`: PostgreSQL pool and connection bootstrap.
- `redis.config.js`: Redis client factory/bootstrap.

Keep business logic out of this layer.
