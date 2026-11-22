import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AccountForm from "../components/AccountForm";
import { accountService } from "../services/accountService";
import type {
  AccountFormValues,
  CreateAccountRequest,
} from "../types/account.types";

export default function CreateAccountPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (values: AccountFormValues) => {
    setLoading(true);
    setError(null);

    const payload: CreateAccountRequest = {
      email: values.email.trim(),
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      phone: values.phone.trim() || undefined,
      password: values.password,
      role: values.role,
    };

    try {
      const account = await accountService.createAccount(payload);

      navigate(`/accounts/${account.id}`);
    } catch (err) {
      const responseError = err as {
        response?: {
          data?: {
            detail?: string;
            message?: string;
          };
        };
      };

      setError(
        responseError.response?.data?.detail ||
          responseError.response?.data?.message ||
          "Unable to create the account. Please check the information and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          to="/accounts"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to accounts
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Create account
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a new user to the Color Paint Distribution system.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <AccountForm loading={loading} onSubmit={handleCreate} />
      </div>
    </div>
  );
}
