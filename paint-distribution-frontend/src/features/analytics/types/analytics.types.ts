export type AnalyticsPeriod =
  | "today"
  | "this_week"
  | "this_month"
  | "this_year"
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "custom";

export interface AnalyticsFilters {
  period: AnalyticsPeriod;
  start_date?: string;
  end_date?: string;
}

export interface AnalyticsStat {
  title: string;
  value: number;
  previous_value?: number;
  percentage_change?: number;
  description?: string;
}

export interface AnalyticsOverview {
  total_revenue: number;
  total_sales: number;
  total_orders: number;
  average_order_value: number;
  total_customers: number;
  total_products: number;
  low_stock_products: number;
  out_of_stock_products: number;
  revenue_change?: number;
  sales_change?: number;
  orders_change?: number;
  customers_change?: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface SalesDataPoint {
  date: string;
  sales: number;
  quantity?: number;
}

export interface OrdersDataPoint {
  date: string;
  orders: number;
  completed?: number;
  pending?: number;
  cancelled?: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sku?: string;
  quantity_sold: number;
  total_revenue: number;
  image?: string | null;
}

export interface RecentSale {
  id: string;
  sale_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface InventoryAnalytics {
  total_products: number;
  total_stock_quantity: number;
  low_stock_products: number;
  out_of_stock_products: number;
  inventory_value: number;
  in_stock_products: number;
}

export interface AnalyticsDashboardResponse {
  overview: AnalyticsOverview;
  revenue_trend: RevenueDataPoint[];
  sales_trend: SalesDataPoint[];
  orders_trend: OrdersDataPoint[];
  top_products: TopProduct[];
  recent_sales: RecentSale[];
  inventory: InventoryAnalytics;
}

export interface SalesAnalyticsResponse {
  total_revenue: number;
  total_sales: number;
  total_orders: number;
  average_order_value: number;
  revenue_trend: RevenueDataPoint[];
  sales_trend: SalesDataPoint[];
  orders_trend: OrdersDataPoint[];
  top_products: TopProduct[];
  recent_sales: RecentSale[];
}

export interface InventoryAnalyticsResponse {
  inventory: InventoryAnalytics;
}

export interface AnalyticsApiError {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}