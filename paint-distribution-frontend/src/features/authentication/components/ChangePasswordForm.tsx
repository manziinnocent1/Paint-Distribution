import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import type { ChangePasswordRequest } from "../types/auth.types";
import { validateChangePassword } from "../schemas/auth.schema";

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordRequest) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export default function ChangePasswordForm({
  onSubmit,
  loading = false,
  error = null,
}: ChangePasswordFormProps) {
  const [formData, setFormData] = useState<ChangePasswordRequest>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateChangePassword(formData);
    setErrors(validation.errors);

    if (!validation.isValid) return;

    try {
      await onSubmit(formData);
      setSuccess(true);

      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch {
      setSuccess(false);
    }
  };

  const fields = [
    {
      name: "current_password",
      label: "Current password",
    },
    {
      name: "new_password",
      label: "New password",
    },
    {
      name: "confirm_password",
      label: "Confirm new password",
    },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {fields.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {field.label}
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id={field.name}
              type={showPasswords ? "text" : "password"}
              value={formData[field.name]}
              onChange={(event) => {
                setFormData((previous) => ({
                  ...previous,
                  [field.name]: event.target.value,
                }));

                setSuccess(false);
              }}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-12 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => setShowPasswords((value) => !value)}
        className="flex items-center gap-2 text-sm text-gray-600"
      >
        {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
        {showPasswords ? "Hide passwords" : "Show passwords"}
      </button>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
        >
          Your password has been changed successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
