# `src/config/env.config.js`

## Purpose

Single source of truth for environment variables and typed numeric parsing.

## Key Variables

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `OTP_EXPIRY_MINUTES`
- `OTP_RESEND_LIMIT`
- `OTP_RESEND_COOLDOWN`

## Future Reference

- Add all new env vars here first.
- Avoid direct `process.env` usage in service/repository layers.
