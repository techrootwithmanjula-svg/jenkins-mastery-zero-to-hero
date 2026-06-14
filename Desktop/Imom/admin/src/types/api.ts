/**
 * API Response and Error Type Definitions
 * Standardized types for API responses, errors, and error handling
 */

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
  status: "success" | "error";
  message: string;
  data?: T;
  timestamp?: string;
  errors?: Record<string, string[]>;
}

export interface ApiErrorResponse {
  status: "error";
  message: string;
  errors?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
  code?: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: Record<string, string[]>;
  public readonly code?: string;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string[]>,
    code?: string
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code;
  }

  /**
   * Get the first error message from the errors object
   * Useful for displaying validation errors
   */
  getFirstError(): string | null {
    if (!this.errors) return null;
    
    for (const field in this.errors) {
      if (this.errors[field]?.length > 0) {
        return this.errors[field][0];
      }
    }
    return null;
  }

  /**
   * Get errors for a specific field
   */
  getFieldErrors(field: string): string[] {
    return this.errors?.[field] ?? [];
  }
}

export class ValidationError extends ApiError {
  constructor(
    message: string,
    errors: Record<string, string[]>,
    statusCode: number = 400
  ) {
    super(message, statusCode, errors, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = "Authentication failed") {
    super(message, 401, undefined, "AUTHENTICATION_ERROR");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = "Access denied") {
    super(message, 403, undefined, "AUTHORIZATION_ERROR");
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(message, 404, undefined, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = "Resource already exists") {
    super(message, 409, undefined, "CONFLICT");
    this.name = "ConflictError";
  }
}

export class NetworkError extends ApiError {
  public readonly originalError?: Error;

  constructor(
    message: string = "Network request failed",
    originalError?: Error
  ) {
    super(message, 0, undefined, "NETWORK_ERROR");
    this.name = "NetworkError";
    this.originalError = originalError;
  }
}

export class TimeoutError extends ApiError {
  constructor(message: string = "Request timeout") {
    super(message, 0, undefined, "TIMEOUT_ERROR");
    this.name = "TimeoutError";
  }
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Check if an error is an instance of ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Check if an error is a validation error
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Check if an error is an authentication error (401)
 */
export function isAuthenticationError(error: unknown): error is AuthenticationError {
  return error instanceof AuthenticationError;
}

/**
 * Check if an error is an authorization error (403)
 */
export function isAuthorizationError(error: unknown): error is AuthorizationError {
  return error instanceof AuthorizationError;
}

/**
 * Check if an error is a network error
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

/**
 * Check if error is a transient error (retryable)
 */
export function isTransientError(error: unknown): boolean {
  if (!isApiError(error)) return false;

  // Retry on network errors, timeouts, and 5xx errors
  return (
    isNetworkError(error) ||
    error.statusCode === 0 ||
    (error.statusCode >= 500 && error.statusCode < 600)
  );
}
