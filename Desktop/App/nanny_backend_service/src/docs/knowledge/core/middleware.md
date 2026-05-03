# `src/core/middleware`

## Purpose

Defines reusable middleware for validation, auth, RBAC, and centralized error handling.

## Files

- `auth.middleware.js`: verifies JWT and attaches user claims.
- `role.middleware.js`: role-based access control gate.
- `validation.middleware.js`: converts validation errors to standardized API errors.
- `error.middleware.js`: final error formatter/logger for all thrown errors.

## Future Reference

- Keep middleware generic and module-agnostic.
