import { useCallback, useEffect, useState } from "react";

import analyticsService from "../services/analyticsService";

import type {
  InventoryAnalyticsResponse,
} from "../types/analytics.types";

export const useInventoryAnalytics = () => {
  const [data, setData] =
    useState<InventoryAnalyticsResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventoryAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result =
        await analyticsService.getInventoryAnalytics();

      setData(result);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load inventory analytics.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchInventoryAnalytics();
  }, [fetchInventoryAnalytics]);

  return {
    data,
    loading,
    error,
    refresh: fetchInventoryAnalytics,
  };
};