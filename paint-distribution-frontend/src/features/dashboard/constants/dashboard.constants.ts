
import type {
  DashboardDateFilter,
  DashboardDateRangeOption,
  DashboardPeriod,
  DashboardStat,
} from "../types/dashboard.types";

export const DEFAULT_DASHBOARD_FILTER: DashboardDateFilter = {
  range: "last_30_days",
};

export const DASHBOARD_DATE_RANGES: DashboardDateRangeOption[] = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 days", value: "last_7_days" },
  { label: "Last 30 days", value: "last_30_days" },
  { label: "This month", value: "this_month" },
  { label: "Last month", value: "last_month" },
  { label: "This year", value: "this_year" },
  { label: "Custom range", value: "custom" },
];

export const DASHBOARD_PERIODS: {
  label: string;
  value: DashboardPeriod;
}[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

export const DASHBOARD_CHART_COLORS = {
  primary: "#2563EB",
  secondary: "#0F766E",
  success: "#16A34A",
  warning: "#D97706",
  danger: "#DC2626",
  purple: "#7C3AED",
  muted: "#94A3B8",
  grid: "#E2E8F0",
};

export const DASHBOARD_STATS_CONFIG: DashboardStat[] = [
  {
    id: "revenue",
    title: "Total Revenue",
    value: 0,
    formattedValue: "RWF 0",
    description: "Revenue within selected period",
    icon: "wallet",
  },
  {
    id: "sales",
    title: "Total Sales",
    value: 0,
    formattedValue: "0",
    description: "Completed sales",
    icon: "shopping-cart",
  },
  {
    id: "orders",
    title: "Total Orders",
    value: 0,
    formattedValue: "0",
    description: "Orders received",
    icon: "clipboard-list",
  },
  {
    id: "customers",
    title: "Total Customers",
    value: 0,
    formattedValue: "0",
    description: "Registered customers",
    icon: "users",
  },
];

export const DASHBOARD_QUERY_KEYS = {
  all: ["dashboard"] as const,
  overview: (filters: object) => ["dashboard", "overview", filters] as const,
  stats: (filters: object) => ["dashboard", "stats", filters] as const,
  revenue: (filters: object) => ["dashboard", "revenue", filters] as const,
  sales: (filters: object) => ["dashboard", "sales", filters] as const,
  inventoryAlerts: ["dashboard", "inventory-alerts"] as const,
};

export const DASHBOARD_REFRESH_INTERVAL = 60_000;

export const DASHBOARD_ROUTES = {
  sales: "/sales",
  newSale: "/sales/new",
  products: "/products",
  inventory: "/inventory",
  customers: "/customers",
  purchases: "/purchases",
  reports: "/reports",
};
