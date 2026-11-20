import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes";
import { NotFoundPage } from "./NotFoundPage";

function PagePlaceholder({ title }: { title: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-3 text-slate-500">
          This module is currently under development.
        </p>
      </div>
    </main>
  );
}

export function AppRouter() {
  return (
    <Routes>
      {/* Default route */}
      <Route
        path={ROUTES.ROOT}
        element={<Navigate to={ROUTES.DASHBOARD} replace />}
      />

      {/* Public routes */}
      <Route
        path={ROUTES.LOGIN}
        element={<PagePlaceholder title="Sign in" />}
      />

      <Route
        path={ROUTES.REGISTER}
        element={<PagePlaceholder title="Create account" />}
      />

      {/* Application routes */}
      <Route
        path={ROUTES.DASHBOARD}
        element={<PagePlaceholder title="Dashboard" />}
      />

      <Route
        path={ROUTES.INVENTORY}
        element={<PagePlaceholder title="Inventory Management" />}
      />

      <Route
        path={ROUTES.PRODUCTS}
        element={<PagePlaceholder title="Products" />}
      />

      <Route
        path={ROUTES.COLORS}
        element={<PagePlaceholder title="Color Management" />}
      />

      <Route
        path={ROUTES.CUSTOMERS}
        element={<PagePlaceholder title="Customers" />}
      />

      <Route
        path={ROUTES.SUPPLIERS}
        element={<PagePlaceholder title="Suppliers" />}
      />

      <Route
        path={ROUTES.PROCUREMENT}
        element={<PagePlaceholder title="Procurement" />}
      />

      <Route path={ROUTES.SALES} element={<PagePlaceholder title="Sales" />} />

      <Route
        path={ROUTES.DELIVERIES}
        element={<PagePlaceholder title="Deliveries" />}
      />

      <Route
        path={ROUTES.PAYMENTS}
        element={<PagePlaceholder title="Payments" />}
      />

      <Route
        path={ROUTES.PRICING}
        element={<PagePlaceholder title="Pricing" />}
      />

      <Route
        path={ROUTES.EXPENSES}
        element={<PagePlaceholder title="Expenses" />}
      />

      <Route
        path={ROUTES.ANALYTICS}
        element={<PagePlaceholder title="Analytics" />}
      />

      <Route
        path={ROUTES.SETTINGS}
        element={<PagePlaceholder title="Settings" />}
      />

      {/* Fallback route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
