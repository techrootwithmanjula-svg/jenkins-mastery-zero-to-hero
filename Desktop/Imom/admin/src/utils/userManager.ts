import { UserRole, type User } from "../types/entities";

const USER_KEY = "user";

export const userManager = {
  getUser: (): User | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  setUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },

  isAdmin: (): boolean => userManager.getUser()?.role === UserRole.ADMIN,
};
