import { Link } from "react-router-dom";
import { ROUTES } from "./routes";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
        Error 404
      </p>

      <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-900">
        Page not found
      </h1>

      <p className="mt-4 max-w-md text-slate-500">
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <Link
        to={ROUTES.ROOT}
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        Return to home
      </Link>
    </main>
  );
}
