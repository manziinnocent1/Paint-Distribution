import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "./routeConfig";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100 text-3xl font-bold text-blue-700">
            404
          </div>
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
          Page not found
        </p>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Oops! This page doesn't exist.
        </h1>

        <p className="mx-auto mb-8 max-w-md text-base leading-7 text-slate-500">
          The page you are looking for may have been moved, removed, or the
          address may be incorrect. Please check the URL and try again.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to={ROUTES.dashboard}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Dashboard
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Go Back
          </button>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-400">
            Color Paint Distribution Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
