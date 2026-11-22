
import { useState } from "react";
import axios from "axios";

import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";

import type {
  LoginCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  AuthErrorResponse,
} from "../types/auth.types";

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<AuthErrorResponse>(error)) {
    const data = error.response?.data;

    if (data?.detail) return data.detail;
    if (data?.message) return data.message;

    if (data?.non_field_errors?.length) {
      return data.non_field_errors[0];
    }

    if (data) {
      const firstError = Object.values(data).find(
        (value) => typeof value === "string"
      );

      if (typeof firstError === "string") return firstError;
    }
  }

  return fallback;
}

export function useAuth() {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);

      setSession(
        response.user,
        {
          access: response.access,
          refresh: response.refresh,
        }
      );

      return response.user;
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Unable to sign in. Please check your credentials."
      );

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } finally {
      clearSession();
      setLoading(false);
    }
  };

  const forgotPassword = async (
    data: ForgotPasswordRequest
  ) => {
    setLoading(true);
    setError(null);

    try {
      return await authService.forgotPassword(data);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to process your password reset request."
        )
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (
    data: ResetPasswordRequest
  ) => {
    setLoading(true);
    setError(null);

    try {
      return await authService.resetPassword(data);
    } catch (err) {
      setError(
        getErrorMessage(err, "Unable to reset your password.")
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (
    data: ChangePasswordRequest
  ) => {
    setLoading(true);
    setError(null);

    try {
      return await authService.changePassword(data);
    } catch (err) {
      setError(
        getErrorMessage(err, "Unable to change your password.")
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    login,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    loading,
    error,
    clearError,
  };
}
