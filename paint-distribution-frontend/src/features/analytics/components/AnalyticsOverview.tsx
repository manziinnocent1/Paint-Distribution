import { Banknote, ShoppingBag, ShoppingCart, Users } from "lucide-react";

import type { AnalyticsOverview as AnalyticsOverviewType } from "../types/analytics.types";

import AnalyticsStatCard from "./AnalyticsStatCard";

interface AnalyticsOverviewProps {
  overview: AnalyticsOverviewType;
  loading?: boolean;
}

export default function AnalyticsOverview({
  overview,
  loading = false,
}: AnalyticsOverviewProps) {
  const cards = [
    {
      title: "Total revenue",
      value: overview.total_revenue,
      change: overview.revenue_change,
      icon: <Banknote size={21} />,
      format: "currency" as const,
    },
    {
      title: "Total sales",
      value: overview.total_sales,
      change: overview.sales_change,
      icon: <ShoppingBag size={21} />,
      format: "number" as const,
    },
    {
      title: "Total orders",
      value: overview.total_orders,
      change: overview.orders_change,
      icon: <ShoppingCart size={21} />,
      format: "number" as const,
    },
    {
      title: "Total customers",
      value: overview.total_customers,
      change: overview.customers_change,
      icon: <Users size={21} />,
      format: "number" as const,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="h-36 animate-pulse rounded-xl border border-gray-200 bg-gray-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <AnalyticsStatCard
          key={card.title}
          title={card.title}
          value={card.value}
          change={card.change}
          icon={card.icon}
          format={card.format}
          description="Compared with previous period"
        />
      ))}
    </div>
  );
}
