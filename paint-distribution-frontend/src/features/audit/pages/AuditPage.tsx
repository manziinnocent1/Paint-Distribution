import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Download, RefreshCw } from "lucide-react";

import AuditSummary from "../components/AuditSummary";
import AuditFilters from "../components/AuditFilters";
import AuditTable from "../components/AuditTable";

import { useAuditLogs } from "../hooks/useAuditLogs";
import { auditService } from "../services/auditService";

import type {
  AuditFilters as AuditFiltersType,
  AuditSummary as AuditSummaryType,
} from "../types/audit.types";

const DEFAULT_FILTERS: AuditFiltersType = {
  search: "",
  action: "",
  entity_type: "",
  actor: "",
  start_date: "",
  end_date: "",
  page: 1,
  page_size: 10,
  ordering: "-created_at",
};

const EMPTY_SUMMARY: AuditSummaryType = {
  total_events: 0,
  today_events: 0,
  create_events: 0,
  update_events: 0,
  delete_events: 0,
  login_events: 0,
};

export default function AuditPage() {
  const [filters, setFilters] = useState<AuditFiltersType>(DEFAULT_FILTERS);

  const [summary, setSummary] = useState<AuditSummaryType>(EMPTY_SUMMARY);

  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const { data, loading, error, refresh } = useAuditLogs(filters);

  const fetchSummary = useCallback(async () => {
    try {
      setSummaryLoading(true);
      setSummaryError(null);

      const result = await auditService.getSummary();

      setSummary(result);
    } catch (err: unknown) {
      setSummaryError(
        err instanceof Error ? err.message : "Unable to load audit summary.",
      );
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSummary();
  }, [fetchSummary]);

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleRefresh = async () => {
    await Promise.all([refresh(), fetchSummary()]);
  };

  const handleExport = () => {
    const logs = data?.results ?? [];

    if (logs.length === 0) {
      return;
    }

    const headers = [
      "ID",
      "User",
      "Email",
      "Action",
      "Entity",
      "Entity ID",
      "Description",
      "IP Address",
      "Date",
    ];

    const rows = logs.map((log) => [
      log.id,
      log.actor
        ? `${log.actor.first_name ?? ""} ${log.actor.last_name ?? ""}`.trim()
        : "System",
      log.actor?.email ?? "",
      log.action,
      log.entity_type,
      log.entity_id ?? "",
      log.description,
      log.ip_address ?? "",
      log.created_at,
    ]);

    const escapeCsv = (value: unknown) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "audit-logs.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil((data?.count ?? 0) / filters.page_size);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>

          <p className="mt-1 text-sm text-gray-500">
            Track and review activities performed across your business system.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={!data?.results.length}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            Export current page
          </button>

          <button
            type="button"
            onClick={() => void handleRefresh()}
            disabled={loading || summaryLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading || summaryLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {summaryError && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
          <AlertCircle size={17} />
          {summaryError}
        </div>
      )}

      <AuditSummary summary={summary} loading={summaryLoading} />

      <div>
        <div className="mb-3">
          <h2 className="text-base font-semibold text-gray-900">
            Activity history
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Search and filter recorded system activities.
          </p>
        </div>

        <AuditFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
        />
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            className="font-semibold hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <p className="text-sm text-gray-500">
          {loading
            ? "Loading audit records..."
            : `${data?.count ?? 0} audit records found`}
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="audit-page-size" className="text-sm text-gray-600">
            Records per page
          </label>

          <select
            id="audit-page-size"
            value={filters.page_size}
            onChange={(event) =>
              setFilters({
                ...filters,
                page_size: Number(event.target.value),
                page: 1,
              })
            }
            className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <AuditTable logs={data?.results ?? []} loading={loading} />

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-sm text-gray-500">
          Page {filters.page} of {Math.max(totalPages, 1)}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={filters.page <= 1 || loading}
            onClick={() =>
              setFilters((current) => ({
                ...current,
                page: current.page - 1,
              }))
            }
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <button
            type="button"
            disabled={loading || !data?.next || filters.page >= totalPages}
            onClick={() =>
              setFilters((current) => ({
                ...current,
                page: current.page + 1,
              }))
            }
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
