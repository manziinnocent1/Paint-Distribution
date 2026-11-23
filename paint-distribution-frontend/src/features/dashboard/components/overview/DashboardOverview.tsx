import type { DashboardStats } from "../../types/dashboard.types";
import {
  Activity,
  ClipboardList,
  Package,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";
import { DashboardStatCard } from "../cards/DashboardStatCard";
import { formatCurrency, formatNumber } from "../../utils/dashboard-formatters";

interface DashboardOverviewProps {
  stats: DashboardStats;
}

export function DashboardOverview({ stats }: DashboardOverviewProps) {
  return (
    <section aria-label="Business overview">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Business overview
        </h2>
        <p className="text-sm text-slate-500">
          Key performance indicators for your business.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          description="Revenue in selected period"
          trend={stats.revenueTrend}
          icon={Wallet}
          iconColor="blue"
        />
        <DashboardStatCard
          title="Total Sales"
          value={formatNumber(stats.totalSales)}
          description="Sales recorded"
          trend={stats.salesTrend}
          icon={ShoppingCart}
          iconColor="green"
        />
        <DashboardStatCard
          title="Total Orders"
          value={formatNumber(stats.totalOrders)}
          description="Orders received"
          trend={stats.ordersTrend}
          icon={ClipboardList}
          iconColor="purple"
        />
        <DashboardStatCard
          title="Customers"
          value={formatNumber(stats.totalCustomers)}
          description="Registered customers"
          trend={stats.customersTrend}
          icon={Users}
          iconColor="orange"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Products"
          value={formatNumber(stats.totalProducts)}
          description="Registered products"
          icon={Package}
          iconColor="blue"
        />
        <DashboardStatCard
          title="Inventory Value"
          value={formatCurrency(stats.totalInventoryValue)}
          description="Estimated stock value"
          icon={Wallet}
          iconColor="green"
        />
        <DashboardStatCard
          title="Low Stock Items"
          value={formatNumber(stats.lowStockItems)}
          description="Products below minimum stock"
          icon={Activity}
          iconColor="orange"
        />
        <DashboardStatCard
          title="Out of Stock"
          value={formatNumber(stats.outOfStockItems)}
          description="Products unavailable"
          icon={Package}
          iconColor="red"
        />
      </div>
    </section>
  );
}
