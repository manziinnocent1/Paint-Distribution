import { Link } from "react-router-dom";
import { useState } from "react";

import AccountTable from "../components/AccountTable";
import AccountFilters from "../components/AccountFilters";
import { useAccounts } from "../hooks/useAccounts";

export default function AccountsPage() {
  const {
    accounts,
    pagination,
    filters,
    loading,
    error,
    setFilters,
    refresh,
    toggleStatus,
  } = useAccounts();

  const [actionError, setActionError] = useState<string | null>(null);

  const handleToggleStatus = async (account: (typeof accounts)[number]) => {
    const action = account.is_active ? "deactivate" : "activate";

    if (
      !window.confirm(`Are you sure you want to ${action} ${account.email}?`)
    ) {
      return;
    }

    setActionError(null);

    try {
      await toggleStatus(account);
    } catch {
      setActionError("Unable to update the account status.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User accounts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage system users, roles and account access.
          </p>
        </div>

        <Link
          to="/accounts/create"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Create account
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <AccountFilters filters={filters} onChange={setFilters} />
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void refresh()}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {actionError && (
        <p role="alert" className="text-sm text-red-600">
          {actionError}
        </p>
      )}

      <AccountTable
        accounts={accounts}
        loading={loading}
        onToggleStatus={handleToggleStatus}
      />

      {pagination && pagination.count > 0 && (
        <div className="flex flex-col justify-between gap-3 text-sm text-gray-600 sm:flex-row sm:items-center">
          <p>
            {pagination.count} account
            {pagination.count === 1 ? "" : "s"} found
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!pagination.previous || loading}
              onClick={() =>
                setFilters({
                  page: Math.max(1, (filters.page ?? 1) - 1),
                })
              }
              className="rounded-lg border border-gray-300 px-3 py-2 disabled:opacity-40"
            >
              Previous
            </button>

            <span>Page {filters.page ?? 1}</span>

            <button
              type="button"
              disabled={!pagination.next || loading}
              onClick={() => setFilters({ page: (filters.page ?? 1) + 1 })}
              className="rounded-lg border border-gray-300 px-3 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
