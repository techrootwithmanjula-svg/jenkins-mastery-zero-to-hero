# `src/routes`

Central route loader.

- `index.js` mounts module routes under `/api`.
- Keeps app bootstrap decoupled from module internals.

Future update rule: register new modules here only once module routes are stable.
