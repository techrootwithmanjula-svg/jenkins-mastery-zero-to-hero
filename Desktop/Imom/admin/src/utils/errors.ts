/**
 * Error Handling Utilities
 * Transform Axios errors into typed API errors and extract meaningful messages
 */

import { AxiosError } from "axios";
import {
  ApiError,
  ApiErrorResponse,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  NetworkError,
  NotFoundError,
  TimeoutError,
  ValidationError,
  isTransientError,
} from "../types/api";
import { tokenManager } from "./tokenManager";

/**
 * Transform Axios error into typed API error
 * Handles various error scenarios and provides type-safe error handling
 */
export function transformError(
  error: unknown
): ApiError {
  // Already an ApiError
  if (error instanceof ApiError) {
    return error;
  }

  // Axios error
  if (error instanceof AxiosError) {
    return transformAxiosError(error);
  }

  // Generic error
  if (error instanceof Error) {
    return new ApiError(error.message, 0);
  }

  // Unknown error
  return new ApiError("An unexpected error occurred", 0);
}

/**
 * Transform Axios error into specific API error type
 */
function transformAxiosError(error: AxiosError): ApiError {
  const status = error.response?.status ?? 0;
  const data = error.response?.data as ApiErrorResponse | undefined;
  const message = data?.message ?? error.message;
  const errors = data?.errors;
  const code = data?.code;

  // Network error (no response)
  if (!error.response) {
    if (error.message === "timeout of 30000ms exceeded") {
      return new TimeoutError(
        "Request timeout. Please check your connection and try again."
      );
    }

    return new NetworkError(
      "Network error. Please check your connection and try again.",
      error
    );
  }

  // Handle specific status codes
  switch (status) {
    case 400:
      return new ValidationError(
        message || "The submitted data is invalid",
        errors || {},
        status
      );

    case 401:
      return new AuthenticationError(
        message || "Please log in to continue"
      );

    case 403:
      return new AuthorizationError(
        message || "You don't have permission to perform this action"
      );

    case 404:
      return new NotFoundError(
        message || "The requested resource was not found"
      );

    case 409:
      return new ConflictError(
        message || "This resource already exists"
      );

    case 429:
      return new ApiError(
        "Too many requests. Please try again later.",
        status,
        undefined,
        "RATE_LIMITED"
      );

    case 500:
    case 502:
    case 503:
    case 504:
      return new ApiError(
        "Server error. Please try again later.",
        status,
        undefined,
        "SERVER_ERROR"
      );

    default:
      return new ApiError(
        message || "Request failed",
        status,
        errors,
        code
      );
  }
}

/**
 * Get user-friendly error message for display
 */
export function formatErrorMessage(
  error: unknown,
  defaultMessage: string = "Something went wrong"
): string {
  const apiError = transformError(error);

  // For validation errors, show first validation error if available
  if (apiError instanceof ValidationError) {
    const firstError = apiError.getFirstError();
    if (firstError) {
      return firstError;
    }
  }

  // For other errors, show the message
  return apiError.message || defaultMessage;
}

/**
 * Extract field-specific validation errors
 */
export function getValidationErrors(
  error: unknown
): Record<string, string[]> {
  const apiError = transformError(error);

  if (apiError instanceof ValidationError && apiError.errors) {
    return apiError.errors;
  }

  return {};
}

/**
 * Check if error should be retried
 */
export function shouldRetry(error: unknown): boolean {
  const apiError = transformError(error);
  return isTransientError(apiError);
}

/**
 * Handle authentication error (401)
 * Clears token and redirects to login
 */
export function handleAuthError(): void {
  tokenManager.clearToken();
  if (typeof window !== "undefined") {
    window.location.href = "/signin";
  }
}

/**
 * Safe error message extraction
 * Returns a message safe to display to users
 */
export function getSafeErrorMessage(
  error: unknown,
  defaultMessage: string = "An error occurred"
): string {
  try {
    const message = formatErrorMessage(error);
    return message || defaultMessage;
  } catch {
    return defaultMessage;
  }
}

/**
 * Log error details for debugging
 * Strips sensitive information before logging
 */
export function logError(
  error: unknown,
  context?: string
): void {
  const apiError = transformError(error);

  const logData = {
    timestamp: new Date().toISOString(),
    context,
    name: apiError.name,
    message: apiError.message,
    statusCode: apiError.statusCode,
    code: apiError.code,
    hasErrors: !!apiError.errors,
  };

  // In production, send to error tracking service (e.g. Sentry)
  if (import.meta.env.PROD) {
    console.error("[Error Log]", logData);
  } else {
    console.error("[Error Log]", logData);
  }
}

/**
 * Check if error is client error (4xx)
 */
export function isClientError(error: unknown): boolean {
  const apiError = transformError(error);
  return apiError.statusCode >= 400 && apiError.statusCode < 500;
}

/**
 * Check if error is server error (5xx)
 */
export function isServerError(error: unknown): boolean {
  const apiError = transformError(error);
  return apiError.statusCode >= 500 && apiError.statusCode < 600;
}

/**
 * Extract error details object
 * Useful for error boundary components
 */
export function getErrorDetails(error: unknown) {
  const apiError = transformError(error);

  return {
    type: apiError.name,
    message: apiError.message,
    statusCode: apiError.statusCode,
    code: apiError.code,
    isRetryable: shouldRetry(error),
    displayMessage: formatErrorMessage(error),
    validationErrors: getValidationErrors(error),
  };
}
