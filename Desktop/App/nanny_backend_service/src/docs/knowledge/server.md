# `src/server.js`

## Purpose

Bootstraps infrastructure and starts HTTP server.

## Responsibilities

- Loads runtime config.
- Attempts DB bootstrap before listening.
- Starts app on configured port.
- Handles `unhandledRejection` and `uncaughtException`.

## Future Reference

- Keep startup orchestration here only.
- If adding queues/workers, initialize them after config bootstrap and before `listen`.
