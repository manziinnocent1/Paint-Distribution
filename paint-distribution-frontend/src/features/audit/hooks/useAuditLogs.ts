import {
  useCallback,
  useEffect,
  useState,
} from "react";

import auditService from "../services/auditService";

import type {
  AuditFilters,
  PaginatedAuditLogs,
} from "../types/audit.types";

export const useAuditLogs = (filters: AuditFilters) => {
  const [data, setData] =
    useState<PaginatedAuditLogs | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await auditService.getLogs(filters);

      setData(result);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load audit logs.",
      );
    } finally {
      setLoading(false);
    }
  }, [
    filters.search,
    filters.action,
    filters.entity_type,
    filters.actor,
    filters.start_date,
    filters.end_date,
    filters.page,
    filters.page_size,
    filters.ordering,
  ]);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  return {
    data,
    loading,
    error,
    refresh: fetchLogs,
  };
};