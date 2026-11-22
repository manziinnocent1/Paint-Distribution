import { useCallback, useEffect, useState } from "react";

import analyticsService from "../services/analyticsService";

import type {
  AnalyticsDashboardResponse,
  AnalyticsFilters,
} from "../types/analytics.types";

export const useAnalytics = (filters: AnalyticsFilters) => {
  const [data, setData] =
    useState<AnalyticsDashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await analyticsService.getDashboard(filters);

      setData(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load analytics data.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filters.period, filters.start_date, filters.end_date]);

  useEffect(() => {
    void fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    refresh: fetchAnalytics,
  };
};