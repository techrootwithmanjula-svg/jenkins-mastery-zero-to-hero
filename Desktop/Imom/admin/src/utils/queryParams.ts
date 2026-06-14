/**
 * Query Parameters Utility
 * Type-safe way to build query parameters for API requests
 */

/**
 * Build query string from parameters object
 * Properly handles undefined/null values, arrays, and nested objects
 */
export function buildQueryString(params: object): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    // Skip undefined and null values
    if (value === undefined || value === null) {
      continue;
    }

    // Skip empty strings
    if (typeof value === "string" && value.trim() === "") {
      continue;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          searchParams.append(key, String(item));
        }
      });
      continue;
    }

    // Handle booleans and numbers
    if (typeof value === "boolean" || typeof value === "number") {
      searchParams.append(key, String(value));
      continue;
    }

    // Handle strings
    if (typeof value === "string") {
      searchParams.append(key, value);
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Build full URL with query parameters
 */
export function buildUrl(
  baseUrl: string,
  params?: Record<string, unknown>
): string {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  return `${baseUrl}${buildQueryString(params)}`;
}

/**
 * Create URLSearchParams from object
 */
export function createSearchParams(
  params: Record<string, unknown>
): URLSearchParams {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    // Skip undefined and null values
    if (value === undefined || value === null) {
      continue;
    }

    // Skip empty strings
    if (typeof value === "string" && value.trim() === "") {
      continue;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          searchParams.append(key, String(item));
        }
      });
      continue;
    }

    // Convert to string for non-array values
    searchParams.append(key, String(value));
  }

  return searchParams;
}

/**
 * Extract specific parameter from query string
 */
export function getQueryParam(query: string, param: string): string | null {
  const params = new URLSearchParams(query);
  return params.get(param);
}

