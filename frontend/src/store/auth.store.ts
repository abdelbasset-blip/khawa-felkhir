import { create } from "zustand";
import { User } from "../types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // true par défaut pour permettre la vérification silencieuse au boot

  setAuth: (user: User, token: string) =>
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    }),

  setToken: (token: string) =>
    set({
      token,
      isAuthenticated: !!token,
    }),

  setUser: (user: User) =>
    set({
      user,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  setLoading: (isLoading: boolean) =>
    set({
      isLoading,
    }),
}));
