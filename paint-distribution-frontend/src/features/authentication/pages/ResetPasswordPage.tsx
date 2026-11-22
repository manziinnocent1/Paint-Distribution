import { Link, useNavigate, useSearchParams } from "react-router-dom";

import AuthIllustration from "../components/AuthIllustration";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { useAuth } from "../hooks/useAuth";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const uid = searchParams.get("uid") ?? "";
  const token = searchParams.get("token") ?? "";

  const { resetPassword, loading, error } = useAuth();

  const handleReset = async (data: Parameters<typeof resetPassword>[0]) => {
    await resetPassword(data);
    navigate("/login", { replace: true });
  };

  const hasValidLink = Boolean(uid && token);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-4 py-8 lg:grid-cols-2 lg:px-8">
        <div className="hidden lg:block">
          <AuthIllustration
            title="Create a new secure password."
            description="Choose a strong password to protect your business account and information."
          />
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
              CP
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Reset your password
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Enter your new password below.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            {!hasValidLink ? (
              <div className="space-y-4">
                <p className="text-sm text-red-600">
                  This password reset link is incomplete or invalid. Please
                  request a new password reset link.
                </p>

                <Link
                  to="/forgot-password"
                  className="block text-center font-semibold text-blue-600 hover:underline"
                >
                  Request another reset link
                </Link>
              </div>
            ) : (
              <ResetPasswordForm
                uid={uid}
                token={token}
                onSubmit={handleReset}
                loading={loading}
                error={error}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
