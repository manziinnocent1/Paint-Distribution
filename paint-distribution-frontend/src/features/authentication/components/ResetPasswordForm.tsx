import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import type { ResetPasswordRequest } from "../types/auth.types";
import { validateResetPassword } from "../schemas/auth.schema";

interface ResetPasswordFormProps {
  uid: string;
  token: string;
  onSubmit: (data: ResetPasswordRequest) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export default function ResetPasswordForm({
  uid,
  token,
  onSubmit,
  loading = false,
  error = null,
}: ResetPasswordFormProps) {
  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data: ResetPasswordRequest = {
      uid,
      token,
      ...formData,
    };

    const validation = validateResetPassword(data);
    setErrors(validation.errors);

    if (!validation.isValid) return;

    try {
      await onSubmit(data);
      setSuccess(true);
    } catch {
      setSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="new_password"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          New password
        </label>

        <div className="relative">
          <Lock
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            id="new_password"
            type={showPassword ? "text" : "password"}
            value={formData.new_password}
            onChange={(event) =>
              setFormData((previous) => ({
                ...previous,
                new_password: event.target.value,
              }))
            }
            placeholder="Enter new password"
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-16 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.new_password && (
          <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirm_password"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Confirm password
        </label>

        <input
          id="confirm_password"
          type={showPassword ? "text" : "password"}
          value={formData.confirm_password}
          onChange={(event) =>
            setFormData((previous) => ({
              ...previous,
              confirm_password: event.target.value,
            }))
          }
          placeholder="Confirm new password"
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />

        {errors.confirm_password && (
          <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>
        )}
      </div>

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
          Your password has been reset successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={loading || success}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Resetting password..." : "Reset password"}
      </button>
    </form>
  );
}
