import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

import AuditDetails from "../components/AuditDetails";
import { useAuditDetails } from "../hooks/useAuditDetails";

export default function AuditDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error, refresh } = useAuditDetails(id);

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/audit"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to audit logs
        </Link>

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Audit Record Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Review the complete information recorded for this event.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          <div className="h-28 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-48 animate-pulse rounded-xl bg-gray-100" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={19} />

            <h2 className="font-semibold">Unable to load audit record</h2>
          </div>

          <p className="mt-2 text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => void refresh()}
            className="mt-4 text-sm font-semibold text-red-700 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && data && <AuditDetails audit={data} />}

      {!loading && !error && !data && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <h2 className="font-semibold text-gray-900">
            Audit record not found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            The requested audit record may no longer be available.
          </p>
        </div>
      )}
    </div>
  );
}
