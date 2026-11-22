import {
  useCallback,
  useEffect,
  useState,
} from "react";

import auditService from "../services/auditService";

import type {
  AuditLog,
} from "../types/audit.types";

export const useAuditDetails = (id?: string) => {
  const [data, setData] = useState<AuditLog | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!id) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await auditService.getLog(id);

      setData(result);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load audit record.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchDetails();
  }, [fetchDetails]);

  return {
    data,
    loading,
    error,
    refresh: fetchDetails,
  };
};