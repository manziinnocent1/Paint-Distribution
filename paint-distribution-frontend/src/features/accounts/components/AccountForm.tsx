import { useState, type FormEvent } from "react";

import type { Account, AccountFormValues } from "../types/account.types";

import { validateAccount } from "../schemas/account.schema";

interface AccountFormProps {
  initialData?: Account;
  loading?: boolean;
  onSubmit: (values: AccountFormValues) => Promise<void>;
}

const emptyValues: AccountFormValues = {
  email: "",
  first_name: "",
  last_name: "",
  phone: "",
  role: "",
  password: "",
  confirm_password: "",
  is_active: true,
};

const roleOptions = [
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Manager" },
  { value: "accountant", label: "Accountant" },
  { value: "sales_person", label: "Sales Person" },
  { value: "inventory_manager", label: "Inventory Manager" },
];

export default function AccountForm({
  initialData,
  loading = false,
  onSubmit,
}: AccountFormProps) {
  const [values, setValues] = useState<AccountFormValues>(() => ({
    ...emptyValues,
    email: initialData?.email ?? "",
    first_name: initialData?.first_name ?? "",
    last_name: initialData?.last_name ?? "",
    phone: initialData?.phone ?? "",
    role: initialData?.role ?? "",
    is_active: initialData?.is_active ?? true,
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (
    name: keyof AccountFormValues,
    value: string | boolean,
  ) => {
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = validateAccount(values, Boolean(initialData));

    if (!result.isValid) {
      setErrors(result.errors as Record<string, string>);
      return;
    }

    await onSubmit(values);
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const renderError = (field: string) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-600">{errors[field]}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">First name *</label>
          <input
            value={values.first_name}
            onChange={(event) => updateField("first_name", event.target.value)}
            className={inputClass}
            disabled={loading}
          />
          {renderError("first_name")}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Last name *</label>
          <input
            value={values.last_name}
            onChange={(event) => updateField("last_name", event.target.value)}
            className={inputClass}
            disabled={loading}
          />
          {renderError("last_name")}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Email address *
          </label>
          <input
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={inputClass}
            disabled={loading}
          />
          {renderError("email")}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Phone number</label>
          <input
            type="tel"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className={inputClass}
            disabled={loading}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Account role *
          </label>
          <select
            value={values.role}
            onChange={(event) => updateField("role", event.target.value)}
            className={inputClass}
            disabled={loading}
          >
            <option value="">Select a role</option>
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {renderError("role")}
        </div>

        {initialData && (
          <div className="flex items-center gap-3 pt-7">
            <input
              id="is_active"
              type="checkbox"
              checked={values.is_active}
              onChange={(event) =>
                updateField("is_active", event.target.checked)
              }
              disabled={loading}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label
              htmlFor="is_active"
              className="text-sm font-medium text-gray-700"
            >
              Account is active
            </label>
          </div>
        )}
      </div>

      {!initialData && (
        <div className="grid grid-cols-1 gap-5 border-t border-gray-200 pt-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Password *</label>
            <input
              type="password"
              autoComplete="new-password"
              value={values.password}
              onChange={(event) => updateField("password", event.target.value)}
              className={inputClass}
              disabled={loading}
            />
            {renderError("password")}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Confirm password *
            </label>
            <input
              type="password"
              autoComplete="new-password"
              value={values.confirm_password}
              onChange={(event) =>
                updateField("confirm_password", event.target.value)
              }
              className={inputClass}
              disabled={loading}
            />
            {renderError("confirm_password")}
          </div>
        </div>
      )}

      <div className="flex justify-end border-t border-gray-200 pt-5">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Save changes"
              : "Create account"}
        </button>
      </div>
    </form>
  );
}
