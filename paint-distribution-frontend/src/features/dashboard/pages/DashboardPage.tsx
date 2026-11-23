import { useMemo, useState } from "react";
import { AlertCircle, BarChart3, RefreshCw } from "lucide-react";

import {
  DashboardHeader,
  DashboardOverview,
  RevenueChart,
  SalesChart,
  SalesByCategoryChart,
  PaymentMethodsChart,
  RecentSalesTable,
  TopSellingProductsTable,
  InventoryAlerts,
  RecentActivities,
  QuickActions,
  TopSellingProducts,
  RevenueCard,
  SalesCard,
  OrdersCard,
  InventoryCard,
} from "../components";

import { DASHBOARD_QUICK_ACTIONS } from "../constants/dashboard-navigation.constants";
import { useDashboard } from "../hooks/useDashboard";
import { getPeriodForRange } from "../utils/dashboard.utils";

import type {
  DashboardDateFilter,
  DashboardFilters,
} from "../types/dashboard.types";

function DashboardSection({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function DashboardLoading() {
  return (
    <div className="space-y-6" aria-label="Loading dashboard" aria-busy="true">
      <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl bg-slate-100"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-80 animate-pulse rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const [dateFilter, setDateFilter] = useState<DashboardDateFilter>({
    range: "last_30_days",
  });

  const filters = useMemo<DashboardFilters>(
    () => ({
      dateRange: dateFilter.range,
      startDate: dateFilter.startDate,
      endDate: dateFilter.endDate,
      period: getPeriodForRange(dateFilter.range),
    }),
    [dateFilter],
  );

  const { data, isLoading, isError, error, isFetching, refetch } =
    useDashboard(filters);

  const isCustomRangeIncomplete =
    dateFilter.range === "custom" &&
    (!dateFilter.startDate ||
      !dateFilter.endDate ||
      dateFilter.startDate > dateFilter.endDate);

  if (isCustomRangeIncomplete) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          onRefresh={() => void refetch()}
          isRefreshing={isFetching}
        />
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          Select a valid start date and end date to view the dashboard.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          onRefresh={() => void refetch()}
          isRefreshing={isFetching}
        />
        <DashboardLoading />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          onRefresh={() => void refetch()}
          isRefreshing={isFetching}
        />

        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-5"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 text-red-600" size={20} />
            <div className="flex-1">
              <h2 className="font-semibold text-red-800">
                Unable to load dashboard
              </h2>
              <p className="mt-1 text-sm text-red-700">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong while loading dashboard data."}
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:underline"
              >
                <RefreshCw size={15} />
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="space-y-7 pb-8">
      <DashboardHeader
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        onRefresh={() => void refetch()}
        isRefreshing={isFetching}
      />

      <DashboardOverview stats={data.stats} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <DashboardSection
          title="Revenue performance"
          description="Revenue compared with the previous period"
        >
          <RevenueChart data={data.revenue.data} />
        </DashboardSection>

        <DashboardSection
          title="Sales performance"
          description="Sales volume compared with the previous period"
        >
          <SalesChart data={data.sales.data} />
        </DashboardSection>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <DashboardSection
          title="Sales by category"
          description="Revenue distribution across product categories"
        >
          <SalesByCategoryChart data={data.categorySales} />
        </DashboardSection>

        <DashboardSection
          title="Payment methods"
          description="How customers pay for their purchases"
        >
          <PaymentMethodsChart data={data.paymentMethods} />
        </DashboardSection>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <RevenueCard summary={data.revenue.summary} />
        <SalesCard summary={data.sales.summary} />
        <OrdersCard
          totalOrders={data.stats.totalOrders}
          pendingOrders={data.stats.pendingOrders}
        />
        <InventoryCard summary={data.inventorySummary} />
      </div>

      <DashboardSection
        title="Recent sales"
        description="The latest sales recorded in your business"
        action={
          <a
            href="/sales"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            View all sales
          </a>
        }
      >
        <RecentSalesTable sales={data.recentSales} />
      </DashboardSection>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <DashboardSection
          title="Top-selling products"
          description="Products generating the highest sales revenue"
        >
          <TopSellingProductsTable products={data.topSellingProducts} />
        </DashboardSection>

        <DashboardSection
          title="Inventory alerts"
          description="Products that need your attention"
        >
          <InventoryAlerts alerts={data.inventoryAlerts} />
        </DashboardSection>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <DashboardSection
          title="Recent activities"
          description="Latest activities across your business"
        >
          <RecentActivities activities={data.recentActivities} />
        </DashboardSection>

        <DashboardSection
          title="Quick actions"
          description="Shortcuts to common business operations"
        >
          <QuickActions actions={DASHBOARD_QUICK_ACTIONS} />
        </DashboardSection>
      </div>

      <DashboardSection
        title="Top products at a glance"
        description="A quick view of your best-performing products"
        action={
          <span className="inline-flex items-center gap-2 text-xs text-slate-500">
            <BarChart3 size={15} />
            Sales performance
          </span>
        }
      >
        <TopSellingProducts products={data.topSellingProducts} />
      </DashboardSection>
    </main>
  );
}

export default DashboardPage;
