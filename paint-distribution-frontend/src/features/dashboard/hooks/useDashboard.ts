
import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS, DASHBOARD_REFRESH_INTERVAL } from "../constants/dashboard.constants";
import { dashboardService } from "../services/dashboardService";
import type { DashboardFilters } from "../types/dashboard.types";

export function useDashboard(filters: DashboardFilters) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.overview(filters),
    queryFn: () => dashboardService.getOverview(filters),
    staleTime: DASHBOARD_REFRESH_INTERVAL,
    refetchInterval: DASHBOARD_REFRESH_INTERVAL,
  });
}
