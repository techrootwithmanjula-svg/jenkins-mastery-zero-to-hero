import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import BASE_URL from "./urls";
import { tokenManager } from "../utils/tokenManager";
import { userManager } from "../utils/userManager";
import { transformError, logError } from "../utils/errors";

/**
 * Create and configure Axios instance
 * Includes request/response interceptors for authentication and error handling
 */
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Store active abort controllers for request cancellation
const abortControllers = new Map<string, AbortController>();

/**
 * Request Interceptor
 * - Adds JWT token to Authorization header
 * - Sets up request cancellation controller
 */
api.interceptors.request.use(
  (config) => {
    // Add authentication token
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set up request cancellation
    const controller = new AbortController();
    const requestKey = `${config.method?.toUpperCase()}-${config.url}`;
    abortControllers.set(requestKey, controller);
    config.signal = controller.signal;

    return config;
  },
  (error) => {
    logError(error, "Request Interceptor");
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Handles authentication errors (401)
 * - Transforms API errors into typed errors
 * - Logs errors for debugging
 * - Cleans up abort controller map to prevent memory leaks
 */
api.interceptors.response.use(
  (response) => {
    const requestKey = `${response.config.method?.toUpperCase()}-${response.config.url}`;
    cleanupController(requestKey);
    return response;
  },
  (error) => {
    if (error.config) {
      const requestKey = `${error.config.method?.toUpperCase()}-${error.config.url}`;
      cleanupController(requestKey);
    }

    const status = error.response?.status;

    // Handle 401/403 — clear session and redirect to sign-in
    if (status === 401 || status === 403) {
      if (typeof window !== "undefined") {
        tokenManager.clearToken();
        userManager.clearUser();
        window.location.href = "/signin";
      }
    }

    // Transform and log error
    const apiError = transformError(error);
    logError(apiError, "Response Interceptor");

    return Promise.reject(apiError);
  }
);

/**
 * Cancel pending request by key
 * Useful for cancelling duplicate or outdated requests
 */
export function cancelRequest(requestKey: string): void {
  const controller = abortControllers.get(requestKey);
  if (controller) {
    controller.abort();
    abortControllers.delete(requestKey);
  }
}

/**
 * Cancel all pending requests
 */
export function cancelAllRequests(): void {
  abortControllers.forEach((controller) => {
    controller.abort();
  });
  abortControllers.clear();
}

/**
 * Clean up request controller after request completes
 */
function cleanupController(requestKey: string): void {
  abortControllers.delete(requestKey);
}

/**
 * Configure request timeout per endpoint (in milliseconds)
 * Higher values for slower endpoints, lower for quick operations
 */
export const REQUEST_TIMEOUTS = {
  DEFAULT: 30000,
  UPLOAD: 120000, // 2 minutes for file uploads
  DOWNLOAD: 60000, // 1 minute for downloads
  QUICK: 10000, // 10 seconds for quick operations
} as const;

export default api;
export type { AxiosInstance, AxiosRequestConfig };