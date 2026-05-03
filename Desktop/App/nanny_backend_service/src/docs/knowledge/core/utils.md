# `src/core/utils`

## Purpose

Houses stateless helper utilities shared across modules.

## Files

- `jwt.util.js`: JWT sign/verify wrappers.
- `otp.util.js`: OTP generation and expiry helpers.
- `logger.util.js`: structured logs + mobile masking helper.
- `response-formatter.util.js`: unified success/error response shape.

## Future Reference

- Keep utilities pure where possible.
- Do not place repository calls in utils.
