
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";

import type { AuthUser } from "../types/auth.types";

export function useCurrentUser() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const clearSession = useAuthStore((state) => state.clearSession);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async (): Promise<AuthUser | null> => {
    if (!accessToken) return null;

    setLoading(true);
    setError(null);

    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response?.status === 401
      ) {
        clearSession();
      } else {
        setError("Unable to retrieve your account information.");
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [accessToken, setUser, clearSession]);

  useEffect(() => {
    if (accessToken && !user) {
      void fetchCurrentUser();
    }
  }, [accessToken, user, fetchCurrentUser]);

  return {
    user,
    loading,
    error,
    fetchCurrentUser,
  };
}
