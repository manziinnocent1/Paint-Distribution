
import api from "@/lib/axios";

import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ApiMessageResponse,
} from "../types/auth.types";

/**
 * Adjust these paths to match apps/accounts/urls.py.
 */
export const AUTH_ENDPOINTS = {
  login: "/accounts/login/",
  logout: "/accounts/logout/",
  refresh: "/accounts/token/refresh/",
  currentUser: "/accounts/me/",
  forgotPassword: "/accounts/password-reset/",
  resetPassword: "/accounts/password-reset/confirm/",
  changePassword: "/accounts/change-password/",
} as const;

export const authService = {
  async login(
    credentials: LoginCredentials
  ): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      AUTH_ENDPOINTS.login,
      credentials
    );

    return response.data;
  },

  async logout(
    refreshToken: string
  ): Promise<void> {
    await api.post(AUTH_ENDPOINTS.logout, {
      refresh: refreshToken,
    });
  },

  async refreshToken(
    data: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>(
      AUTH_ENDPOINTS.refresh,
      data
    );

    return response.data;
  },

  async getCurrentUser(): Promise<AuthUser> {
    const response = await api.get<AuthUser>(
      AUTH_ENDPOINTS.currentUser
    );

    return response.data;
  },

  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ApiMessageResponse> {
    const response = await api.post<ApiMessageResponse>(
      AUTH_ENDPOINTS.forgotPassword,
      data
    );

    return response.data;
  },

  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ApiMessageResponse> {
    const response = await api.post<ApiMessageResponse>(
      AUTH_ENDPOINTS.resetPassword,
      data
    );

    return response.data;
  },

  async changePassword(
    data: ChangePasswordRequest
  ): Promise<ApiMessageResponse> {
    const response = await api.post<ApiMessageResponse>(
      AUTH_ENDPOINTS.changePassword,
      data
    );

    return response.data;
  },
};
