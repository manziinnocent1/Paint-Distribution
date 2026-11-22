import { useNavigate } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import AuthIllustration from "../components/AuthIllustration";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    await login(credentials);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-4 py-8 lg:grid-cols-2 lg:px-8">
        <div className="hidden lg:block">
          <AuthIllustration />
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
              CP
            </div>

            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to your Color Paint Distribution account.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Sign in to your account
            </h2>

            <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
          </div>

          <p className="mt-8 text-center text-xs text-gray-400">
            Color Paint Distribution Management System
          </p>
        </div>
      </div>
    </div>
  );
}
