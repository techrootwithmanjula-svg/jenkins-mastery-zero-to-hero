# `src/config/redis.config.js`

## Purpose

Provides lazy Redis client initialization.

## Runtime Behavior

- If `REDIS_URL` is missing: logs warning and skips Redis bootstrap.
- Reuses singleton client instance after first call.

## Future Reference

- Integrate OTP rate-limit caching or session caching through this client.
