import { Link } from "react-router-dom";

import AuthIllustration from "../components/AuthIllustration";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import { useAuth } from "../hooks/useAuth";

export default function ForgotPasswordPage() {
  const { forgotPassword, loading, error } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-4 py-8 lg:grid-cols-2 lg:px-8">
        <div className="hidden lg:block">
          <AuthIllustration
            title="Recover access to your account."
            description="We'll help you securely regain access to your business management platform."
          />
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
              CP
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Forgot your password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Enter your registered email address and we'll send instructions to
              reset your password.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <ForgotPasswordForm
              onSubmit={forgotPassword}
              loading={loading}
              error={error}
            />
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
