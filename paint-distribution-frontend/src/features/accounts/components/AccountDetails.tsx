import type { Account } from "../types/account.types";
import AccountStatusBadge from "./AccountStatusBadge";

interface AccountDetailsProps {
  account: Account;
  onEdit?: () => void;
}

function formatDate(value?: string | null): string {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AccountDetails({
  account,
  onEdit,
}: AccountDetailsProps) {
  const details = [
    { label: "First name", value: account.first_name },
    { label: "Last name", value: account.last_name },
    { label: "Email address", value: account.email },
    { label: "Phone number", value: account.phone || "Not provided" },
    {
      label: "Role",
      value: account.role.replaceAll("_", " "),
    },
    { label: "Date joined", value: formatDate(account.date_joined) },
    { label: "Last login", value: formatDate(account.last_login) },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col justify-between gap-4 border-b border-gray-200 p-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {account.first_name} {account.last_name}
          </h2>
          <p className="mt-1 text-sm text-gray-500">Account ID: {account.id}</p>
        </div>

        <div className="flex items-center gap-3">
          <AccountStatusBadge
            isActive={account.is_active}
            isVerified={account.is_verified}
          />

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Edit account
            </button>
          )}
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
        {details.map((detail) => (
          <div key={detail.label}>
            <dt className="text-sm text-gray-500">{detail.label}</dt>
            <dd className="mt-1 break-words text-sm font-medium capitalize text-gray-900">
              {detail.value}
            </dd>
          </div>
        ))}

        <div>
          <dt className="text-sm text-gray-500">Email verification</dt>
          <dd className="mt-1 text-sm font-medium text-gray-900">
            {account.is_verified ? "Verified" : "Not verified"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
