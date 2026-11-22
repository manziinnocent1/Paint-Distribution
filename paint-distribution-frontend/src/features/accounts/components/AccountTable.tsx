import { Link } from "react-router-dom";

import type { Account } from "../types/account.types";
import AccountStatusBadge from "./AccountStatusBadge";

interface AccountTableProps {
  accounts: Account[];
  loading?: boolean;
  onToggleStatus?: (account: Account) => void;
}

function formatRole(role: string): string {
  return role
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function AccountTable({
  accounts,
  loading = false,
  onToggleStatus,
}: AccountTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        Loading accounts...
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <h3 className="font-semibold text-gray-900">No accounts found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try changing your filters or create a new account.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-left">
        <thead className="bg-gray-50">
          <tr>
            {["User", "Email", "Role", "Status", "Date joined", "Actions"].map(
              (heading) => (
                <th
                  key={heading}
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {accounts.map((account) => (
            <tr key={account.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-5 py-4">
                <div className="font-medium text-gray-900">
                  {account.first_name} {account.last_name}
                </div>
                <div className="text-xs text-gray-500">
                  {account.phone || "No phone number"}
                </div>
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                {account.email}
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                {formatRole(account.role)}
              </td>

              <td className="whitespace-nowrap px-5 py-4">
                <AccountStatusBadge
                  isActive={account.is_active}
                  isVerified={account.is_verified}
                />
              </td>

              <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                {formatDate(account.date_joined)}
              </td>

              <td className="whitespace-nowrap px-5 py-4">
                <div className="flex items-center gap-3 text-sm">
                  <Link
                    to={`/accounts/${account.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    View
                  </Link>

                  {onToggleStatus && (
                    <button
                      type="button"
                      onClick={() => onToggleStatus(account)}
                      className="font-medium text-gray-600 hover:text-gray-900"
                    >
                      {account.is_active ? "Deactivate" : "Activate"}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
