/**
 * Centralized API Endpoint Configuration
 *
 * Vite exposes env variables via `import.meta.env`, not `process.env`.
 * All services should import the specific URL group they need (AUTH_URLS,
 * USER_URLS, NANNY_URLS, STATS_URLS) rather than constructing paths inline.
 */

// ============================================================================
// BASE URL
// ============================================================================

const BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "https://backend-service-7jrs.onrender.com/api";

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

export const AUTH_URLS = {
  SEND_OTP: "/auth/send-otp",
  VERIFY_OTP: "/auth/verify-otp",
  RESEND_OTP: "/auth/resend-otp",
} as const;

// ============================================================================
// USER MANAGEMENT ENDPOINTS
// ============================================================================

export const USER_URLS = {
  CREATE: "/admin/users",
  LIST: "/admin/users",
  UPDATE: (id: string | number) => `/admin/users/${id}`,
  DELETE: (id: string | number) => `/admin/users/${id}`,
} as const;

// ============================================================================
// NANNY MANAGEMENT ENDPOINTS
// ============================================================================

export const NANNY_URLS = {
  CREATE: "/admin/nannies",
  LIST: "/admin/nannies",
  UPDATE: (id: string | number) => `/admin/nannies/${id}`,
  DELETE: (id: string | number) => `/admin/nannies/${id}`,
} as const;

// ============================================================================
// STATISTICS ENDPOINTS
// ============================================================================

export const STATS_URLS = {
  GET_DASHBOARD_STATS: "/admin/stats",
} as const;

// ============================================================================
// SUBSCRIPTION MANAGEMENT ENDPOINTS
// ============================================================================

export const SUBSCRIPTION_URLS = {
  LIST: "/admin/subscriptions",
  REPLACEMENTS: "/admin/subscriptions/replacements",
  UPDATE_LIMITS: (subscriptionId: string | number) =>
    `/admin/subscriptions/${subscriptionId}/limits`,
  COMPLETE_REPLACEMENT: (subscriptionId: string | number, replacementId: string | number) =>
    `/admin/subscriptions/${subscriptionId}/replacements/${replacementId}/complete`,
  REJECT_REPLACEMENT: (subscriptionId: string | number, replacementId: string | number) =>
    `/admin/subscriptions/${subscriptionId}/replacements/${replacementId}/reject`,
} as const;

export const SUBSCRIPTION_PLAN_URLS = {
  LIST: "/admin/subscription-plans",
  GET: (id: string) => `/admin/subscription-plans/${id}`,
  UPDATE: (id: string) => `/admin/subscription-plans/${id}`,
} as const;

// ============================================================================
// BOOKING MANAGEMENT ENDPOINTS
// ============================================================================

export const BOOKING_URLS = {
  LIST: "/admin/bookings",
  CANCEL: (id: string | number) => `/bookings/${id}/cancel`,
} as const;

export default BASE_URL;
