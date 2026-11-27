import api from "../../../lib/axios";

import type {
  AnalyticsDashboardResponse,
  AnalyticsFilters,
  InventoryAnalyticsResponse,
  SalesAnalyticsResponse,
} from "../types/analytics.types";

const BASE_URL = "/analytics";

const buildParams = (filters: AnalyticsFilters) => {
  const params: Record<string, string> = {
    period: filters.period,
  };

  if (filters.start_date) {
    params.start_date = filters.start_date;
  }

  if (filters.end_date) {
    params.end_date = filters.end_date;
  }

  return params;
};

export const analyticsService = {
  async getDashboard(
    filters: AnalyticsFilters,
  ): Promise<AnalyticsDashboardResponse> {
    const response = await api.get<AnalyticsDashboardResponse>(
      `${BASE_URL}/dashboard/`,
      { params: buildParams(filters) },
    );

    return response.data;
  },

  async getSalesAnalytics(
    filters: AnalyticsFilters,
  ): Promise<SalesAnalyticsResponse> {
    const response = await api.get<SalesAnalyticsResponse>(
      `${BASE_URL}/sales/`,
      { params: buildParams(filters) },
    );

    return response.data;
  },

  async getInventoryAnalytics(): Promise<InventoryAnalyticsResponse> {
    const response = await api.get<InventoryAnalyticsResponse>(
      `${BASE_URL}/inventory/`,
    );

    return response.data;
  },
};

export default analyticsService;