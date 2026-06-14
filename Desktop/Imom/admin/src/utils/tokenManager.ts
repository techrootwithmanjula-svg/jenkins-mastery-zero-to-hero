const TOKEN_KEY = "accessToken";

export const tokenManager = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),

  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),

  removeToken: (): void => localStorage.removeItem(TOKEN_KEY),

  /** Alias for removeToken — used by api/error interceptors */
  clearToken: (): void => localStorage.removeItem(TOKEN_KEY),

  isLoggedIn: (): boolean => !!localStorage.getItem(TOKEN_KEY),
};