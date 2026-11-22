import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import AccountDetails from "../components/AccountDetails";
import AccountForm from "../components/AccountForm";
import { useAccountDetails } from "../hooks/useAccountDetails";
import type { AccountFormValues } from "../types/account.types";

export default function AccountDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { account, loading, error, refresh, updateAccount } =
    useAccountDetails(id);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleUpdate = async (values: AccountFormValues) => {
    setSaving(true);
    setSaveError(null);

    try {
      await updateAccount({
        email: values.email.trim(),
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        phone: values.phone.trim() || undefined,
        role: values.role,
        is_active: values.is_active,
      });

      setEditing(false);
    } catch {
      setSaveError("Unable to update this account.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-sm text-gray-500">Loading account...</p>;
  }

  if (error || !account) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">{error || "Account not found."}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="text-sm font-medium text-blue-600"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/accounts"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to accounts
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Account details
        </h1>
      </div>

      {saveError && (
        <p role="alert" className="text-sm text-red-600">
          {saveError}
        </p>
      )}

      {editing ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold">Edit account</h2>

          <AccountForm
            initialData={account}
            loading={saving}
            onSubmit={handleUpdate}
          />

          <button
            type="button"
            onClick={() => setEditing(false)}
            disabled={saving}
            className="mt-3 text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel editing
          </button>
        </div>
      ) : (
        <AccountDetails account={account} onEdit={() => setEditing(true)} />
      )}

      <button
        type="button"
        onClick={() => navigate("/accounts")}
        className="text-sm text-gray-500 hover:text-gray-800"
      >
        Return to accounts list
      </button>
    </div>
  );
}
