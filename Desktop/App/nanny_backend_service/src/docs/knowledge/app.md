# `src/app.js`

## Purpose

Initializes Express middleware stack and mounts API routes.

## Responsibilities

- Security and request middleware (`helmet`, JSON parser, URL-encoded parser, request logging).
- Swagger UI mounting (`/api-docs`).
- API route mounting under `/api`.
- Health endpoint (`/health`).
- Central error middleware registration (must remain last).

## Future Reference

- Add new global middleware here only if it is cross-cutting.
- Keep module-specific middleware inside module routes.
