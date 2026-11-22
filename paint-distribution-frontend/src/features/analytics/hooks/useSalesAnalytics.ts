import { useCallback, useEffect, useState } from "react";

import analyticsService from "../services/analyticsService";

import type {
  AnalyticsFilters,
  SalesAnalyticsResponse,
} from "../types/analytics.types";

export const useSalesAnalytics = (filters: AnalyticsFilters) => {
  const [data, setData] = useState<SalesAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalesAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result =
        await analyticsService.getSalesAnalytics(filters);

      setData(result);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load sales analytics.",
      );
    } finally {
      setLoading(false);
    }
  }, [filters.period, filters.start_date, filters.end_date]);

  useEffect(() => {
    void fetchSalesAnalytics();
  }, [fetchSalesAnalytics]);

  return {
    data,
    loading,
    error,
    refresh: fetchSalesAnalytics,
  };
};