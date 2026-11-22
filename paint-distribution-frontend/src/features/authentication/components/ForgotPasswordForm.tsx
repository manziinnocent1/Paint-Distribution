import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

import type { ForgotPasswordRequest } from "../types/auth.types";
import { validateForgotPassword } from "../schemas/auth.schema";

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordRequest) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export default function ForgotPasswordForm({
  onSubmit,
  loading = false,
  error = null,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateForgotPassword({ email });

    if (!validation.isValid) {
      setValidationError(validation.errors.email);
      return;
    }

    setValidationError("");

    try {
      await onSubmit({ email });
      setSuccess(true);
    } catch {
      setSuccess(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Email address
        </label>

        <div className="relative">
          <Mail
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setValidationError("");
              setSuccess(false);
            }}
            placeholder="Enter your registered email"
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {validationError && (
          <p className="mt-1 text-sm text-red-600">{validationError}</p>
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
          If an account exists for this email, password reset instructions will
          be sent.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send reset instructions"}
      </button>

      <div className="text-center">
        <Link
          to="/login"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </form>
  );
}
