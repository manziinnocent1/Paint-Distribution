import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import NotFoundPage from "./NotFoundPage";

import {
  ROUTES,
  PUBLIC_ROUTES,
  PROTECTED_ROUTES,
  type RouteDefinition,
} from "./routeConfig";

interface ModulePageProps {
  title: string;
  description: string;
}

const ModulePage = ({ title, description }: ModulePageProps) => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-blue-600">
            Color Paint Distribution
          </p>

          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>

          <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6">
            <p className="text-sm font-medium text-slate-700">{title} module</p>

            <p className="mt-2 text-sm text-slate-500">
              The module routing is configured successfully. The feature
              interface will be connected here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PublicPageProps {
  title: string;
  description: string;
}

const PublicPage = ({ title, description }: PublicPageProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Color Paint Distribution
        </p>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">{title}</h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>

        <p className="mt-6 text-xs text-slate-400">
          Authentication interface will be connected here.
        </p>
      </div>
    </div>
  );
};

const renderProtectedRoute = (route: RouteDefinition) => {
  return (
    <Route
      key={route.path}
      path={route.path}
      element={
        <ProtectedRoute allowedRoles={route.allowedRoles}>
          <ModulePage title={route.title} description={route.description} />
        </ProtectedRoute>
      }
    />
  );
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Default application route */}
      <Route
        path={ROUTES.root}
        element={<Navigate to={ROUTES.dashboard} replace />}
      />

      {/* Public routes */}
      <Route element={<PublicRoute />}>
        {PUBLIC_ROUTES.map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <PublicPage
                title={
                  path === ROUTES.login
                    ? "Welcome Back"
                    : path === ROUTES.register
                      ? "Create Account"
                      : path === ROUTES.forgotPassword
                        ? "Forgot Password"
                        : "Reset Password"
                }
                description="Access your Color Paint Distribution account."
              />
            }
          />
        ))}
      </Route>

      {/* Protected application modules */}
      {PROTECTED_ROUTES.map(renderProtectedRoute)}

      {/* Unknown routes */}
      <Route path={ROUTES.notFound} element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
