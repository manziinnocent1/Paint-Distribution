import api from "../../../lib/axios";

import type {
  AuditFilters,
  AuditLog,
  PaginatedAuditLogs,
  AuditSummary,
} from "../types/audit.types";

const BASE_URL = "/audit/logs/";

const buildParams = (filters: AuditFilters) => {
  const params: Record<string, string | number> = {
    page: filters.page,
    page_size: filters.page_size,
  };

  if (filters.search) {
    params.search = filters.search;
  }

  if (filters.action) {
    params.action = filters.action;
  }

  if (filters.entity_type) {
    params.entity_type = filters.entity_type;
  }

  if (filters.actor) {
    params.actor = filters.actor;
  }

  if (filters.start_date) {
    params.start_date = filters.start_date;
  }

  if (filters.end_date) {
    params.end_date = filters.end_date;
  }

  if (filters.ordering) {
    params.ordering = filters.ordering;
  }

  return params;
};

export const auditService = {
  async getLogs(
    filters: AuditFilters,
  ): Promise<PaginatedAuditLogs> {
    const response = await api.get<PaginatedAuditLogs>(
      BASE_URL,
      { params: buildParams(filters) },
    );

    return response.data;
  },

  async getLog(id: string): Promise<AuditLog> {
    const response = await api.get<AuditLog>(
      `${BASE_URL}${id}/`,
    );

    return response.data;
  },

  async getSummary(): Promise<AuditSummary> {
    const response = await api.get<AuditSummary>(
      `${BASE_URL}summary/`,
    );

    return response.data;
  },
};

export default auditService;