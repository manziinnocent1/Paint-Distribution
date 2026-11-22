import * as React from "react";
import { Outlet } from "react-router-dom";
import { Paintbrush } from "lucide-react";

export interface AuthLayoutProps {
  children?: React.ReactNode;
  companyName?: string;
}

export function AuthLayout({
  children,
  companyName = "Color Distribution",
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-50 px-4 py-10">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <Paintbrush className="h-7 w-7" />
          </div>

          <h1 className="text-xl font-bold text-gray-900">{companyName}</h1>

          <p className="mt-1 text-sm text-gray-500">
            Business Management System
          </p>
        </div>

        {/* Authentication content */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {children ?? <Outlet />}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
