
import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS } from "../constants/dashboard.constants";
import { dashboardService } from "../services/dashboardService";
import type { DashboardFilters } from "../types/dashboard.types";

export function useSalesAnalytics(filters: DashboardFilters) {
  const revenueQuery = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.revenue(filters),
    queryFn: () => dashboardService.getRevenue(filters),
    staleTime: 60_000,
  });

  const salesQuery = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.sales(filters),
    queryFn: () => dashboardService.getSales(filters),
    staleTime: 60_000,
  });

  return {
    revenue: revenueQuery.data,
    sales: salesQuery.data,
    isLoading: revenueQuery.isLoading || salesQuery.isLoading,
    isError: revenueQuery.isError || salesQuery.isError,
    error: revenueQuery.error ?? salesQuery.error,
    refetch: async () => {
      await Promise.all([revenueQuery.refetch(), salesQuery.refetch()]);
    },
  };
}
