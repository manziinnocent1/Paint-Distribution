
/**
 * Dashboard Types
 *
 * Shared TypeScript contracts for the Color Paint Distribution dashboard.
 * These types describe the frontend dashboard data and are not intended
 * to represent verified Django serializer fields.
 */

/* -------------------------------------------------------------------------- */
/*                              Common Types                                  */
/* -------------------------------------------------------------------------- */

export type DashboardDateRange =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "last_month"
  | "this_year"
  | "custom";

export type DashboardPeriod =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export type DashboardTrendDirection =
  | "up"
  | "down"
  | "neutral";

export type DashboardStatus =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

/* -------------------------------------------------------------------------- */
/*                            Date Filter Types                               */
/* -------------------------------------------------------------------------- */

export interface DashboardDateFilter {
  range: DashboardDateRange;
  startDate?: string;
  endDate?: string;
}

export interface DashboardDateRangeOption {
  label: string;
  value: DashboardDateRange;
}

/* -------------------------------------------------------------------------- */
/*                           Dashboard Statistics                             */
/* -------------------------------------------------------------------------- */

export interface DashboardTrend {
  value: number;
  direction: DashboardTrendDirection;
  label: string;
  percentage?: boolean;
}

export interface DashboardStat {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  description?: string;
  trend?: DashboardTrend;
  icon?: string;
  status?: DashboardStatus;
}

export interface DashboardStats {
  totalRevenue: number;
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  totalInventoryValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  pendingPayments: number;
  pendingOrders: number;
  revenueTrend: DashboardTrend;
  salesTrend: DashboardTrend;
  ordersTrend: DashboardTrend;
  customersTrend: DashboardTrend;
}

/* -------------------------------------------------------------------------- */
/*                              Revenue Types                                 */
/* -------------------------------------------------------------------------- */

export interface RevenueDataPoint {
  date: string;
  label: string;
  revenue: number;
  previousRevenue?: number;
  targetRevenue?: number;
}

export interface RevenueSummary {
  currentRevenue: number;
  previousRevenue: number;
  revenueChange: number;
  averageRevenue: number;
  highestRevenue: number;
  lowestRevenue: number;
}

export interface RevenueAnalytics {
  period: DashboardPeriod;
  data: RevenueDataPoint[];
  summary: RevenueSummary;
}

/* -------------------------------------------------------------------------- */
/*                               Sales Types                                  */
/* -------------------------------------------------------------------------- */

export interface SalesDataPoint {
  date: string;
  label: string;
  sales: number;
  previousSales?: number;
}

export interface SalesSummary {
  totalSales: number;
  previousSales: number;
  salesChange: number;
  averageSales: number;
  highestSales: number;
  lowestSales: number;
}

export interface SalesAnalytics {
  period: DashboardPeriod;
  data: SalesDataPoint[];
  summary: SalesSummary;
}

/* -------------------------------------------------------------------------- */
/*                         Product Category Analytics                         */
/* -------------------------------------------------------------------------- */

export interface CategorySalesData {
  categoryId: string;
  categoryName: string;
  totalSales: number;
  totalRevenue: number;
  percentage: number;
  color?: string;
}

/* -------------------------------------------------------------------------- */
/*                          Payment Method Analytics                          */
/* -------------------------------------------------------------------------- */

export type PaymentMethod =
  | "cash"
  | "mobile_money"
  | "card"
  | "bank_transfer"
  | "other";

export interface PaymentMethodData {
  method: PaymentMethod;
  label: string;
  transactionCount: number;
  totalAmount: number;
  percentage: number;
  color?: string;
}

/* -------------------------------------------------------------------------- */
/*                              Sales Records                                 */
/* -------------------------------------------------------------------------- */

export type SaleStatus =
  | "completed"
  | "pending"
  | "cancelled"
  | "refunded"
  | "partially_paid";

export interface DashboardSale {
  id: string;
  saleNumber: string;
  customerId?: string;
  customerName: string;
  saleDate: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMethod?: PaymentMethod;
  status: SaleStatus;
  itemCount: number;
}

/* -------------------------------------------------------------------------- */
/*                              Product Types                                 */
/* -------------------------------------------------------------------------- */

export interface DashboardProduct {
  id: string;
  productName: string;
  productCode: string;
  categoryName: string;
  brandName?: string;
  imageUrl?: string;
  quantitySold: number;
  totalRevenue: number;
  unitPrice: number;
  currentStock: number;
  unit?: string;
}

/* -------------------------------------------------------------------------- */
/*                             Inventory Types                                */
/* -------------------------------------------------------------------------- */

export type InventoryAlertLevel =
  | "low_stock"
  | "out_of_stock"
  | "reorder_required";

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  categoryName?: string;
  currentStock: number;
  minimumStock: number;
  reorderQuantity?: number;
  unit?: string;
  alertLevel: InventoryAlertLevel;
  warehouseName?: string;
  createdAt: string;
}

export interface InventorySummary {
  totalProducts: number;
  totalStockQuantity: number;
  totalInventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  reorderRequiredCount: number;
}

/* -------------------------------------------------------------------------- */
/*                           Recent Activity Types                            */
/* -------------------------------------------------------------------------- */

export type ActivityType =
  | "sale_created"
  | "sale_completed"
  | "sale_cancelled"
  | "payment_received"
  | "product_created"
  | "product_updated"
  | "stock_added"
  | "stock_removed"
  | "customer_created"
  | "purchase_created"
  | "order_created"
  | "order_completed"
  | "user_login"
  | "other";

export interface DashboardActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  userName?: string;
  entityId?: string;
  entityType?: string;
  status?: DashboardStatus;
}

/* -------------------------------------------------------------------------- */
/*                             Quick Action Types                             */
/* -------------------------------------------------------------------------- */

export interface DashboardQuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  permission?: string;
}

/* -------------------------------------------------------------------------- */
/*                              Dashboard Filters                             */
/* -------------------------------------------------------------------------- */

export interface DashboardFilters {
  dateRange: DashboardDateRange;
  startDate?: string;
  endDate?: string;
  period: DashboardPeriod;
}

export interface DashboardQueryParams {
  startDate?: string;
  endDate?: string;
  period?: DashboardPeriod;
}

/* -------------------------------------------------------------------------- */
/*                           Dashboard API Responses                          */
/* -------------------------------------------------------------------------- */

export interface DashboardOverviewResponse {
  stats: DashboardStats;
  revenue: RevenueAnalytics;
  sales: SalesAnalytics;
  categorySales: CategorySalesData[];
  paymentMethods: PaymentMethodData[];
  recentSales: DashboardSale[];
  topSellingProducts: DashboardProduct[];
  inventoryAlerts: InventoryAlert[];
  recentActivities: DashboardActivity[];
  inventorySummary: InventorySummary;
}

export interface DashboardApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/* -------------------------------------------------------------------------- */
/*                             Dashboard Widgets                              */
/* -------------------------------------------------------------------------- */

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  visible: boolean;
  order: number;
  permission?: string;
}

export interface DashboardLayoutConfig {
  widgets: DashboardWidgetConfig[];
}

/* -------------------------------------------------------------------------- */
/*                              Chart Types                                   */
/* -------------------------------------------------------------------------- */

export interface DashboardChartTooltipItem {
  name: string;
  value: number;
  color?: string;
  formattedValue?: string;
}

export interface DashboardChartConfig {
  title: string;
  description?: string;
  period: DashboardPeriod;
  showLegend?: boolean;
  showGrid?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                           Dashboard Loading State                          */
/* -------------------------------------------------------------------------- */

export interface DashboardLoadingState {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage?: string;
}
