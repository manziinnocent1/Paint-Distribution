
import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS } from "../constants/dashboard.constants";
import { dashboardService } from "../services/dashboardService";

export function useInventoryAlerts() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.inventoryAlerts,
    queryFn: () => dashboardService.getInventoryAlerts(),
    staleTime: 60_000,
  });
}
