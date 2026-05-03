# `src/config/database.config.js`

## Purpose

Provides PostgreSQL pool, query helpers, and startup connectivity check.

## Runtime Behavior

- If `DATABASE_URL` is missing: warns and skips bootstrap.
- In non-production: warns and continues when DB is unreachable.
- In production: throws and prevents server start when DB is unreachable.

## Future Reference

- Keep SQL-specific helper utilities here, not in services.
- Use repository layer for all DB access.
