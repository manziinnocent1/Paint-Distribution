
import { create } from "zustand";

import type {
  AuthUser,
  AuthState,
  AuthTokens,
} from "../types/auth.types";

interface AuthActions {
  setSession: (
    user: AuthUser,
    tokens: AuthTokens
  ) => void;

  setUser: (user: AuthUser) => void;

  setAccessToken: (token: string) => void;

  setLoading: (loading: boolean) => void;

  clearSession: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  setSession: (user, tokens) =>
    set({
      user,
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
      isAuthenticated: true,
      isLoading: false,
    }),

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  setAccessToken: (token) =>
    set({
      accessToken: token,
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  clearSession: () =>
    set({
      ...initialState,
    }),
}));
