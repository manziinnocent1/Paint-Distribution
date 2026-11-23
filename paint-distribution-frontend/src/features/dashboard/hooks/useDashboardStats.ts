
import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS } from "../constants/dashboard.constants";
import { dashboardService } from "../services/dashboardService";
import type { DashboardFilters } from "../types/dashboard.types";

export function useDashboardStats(filters: DashboardFilters) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.stats(filters),
    queryFn: () => dashboardService.getStats(filters),
    staleTime: 60_000,
  });
}
