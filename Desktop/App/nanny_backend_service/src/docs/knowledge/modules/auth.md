# `src/modules/auth`

## Purpose

Handles OTP login and token issuance.

## Current APIs

- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/resend-otp`

## Layer Responsibilities

- Controller: HTTP in/out only.
- Service: OTP, cooldown, attempts, resend rules, JWT orchestration.
- Repository: SQL queries for `users` and `otp`.
- Validation: mobile/OTP request checks.

## Future Reference

- Keep OTP security policies in service layer only.
- Keep SQL and transactions in repository layer only.
