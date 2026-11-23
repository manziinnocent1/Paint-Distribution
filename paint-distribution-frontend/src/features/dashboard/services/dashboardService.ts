
import type {
  DashboardActivity,
  DashboardFilters,
  DashboardOverviewResponse,
  DashboardProduct,
  DashboardSale,
  InventoryAlert,
} from "../types/dashboard.types";
import { createTrend } from "../utils/dashboard.utils";

const today = new Date();

function daysAgo(days: number): string {
  const date = new Date(today);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

const recentSales: DashboardSale[] = [
  {
    id: "sale-001",
    saleNumber: "SAL-2026-001",
    customerName: "Kigali Construction Ltd",
    saleDate: daysAgo(0),
    totalAmount: 1250000,
    paidAmount: 1250000,
    balanceAmount: 0,
    paymentMethod: "mobile_money",
    status: "completed",
    itemCount: 8,
  },
  {
    id: "sale-002",
    saleNumber: "SAL-2026-002",
    customerName: "Jean Claude N.",
    saleDate: daysAgo(0),
    totalAmount: 340000,
    paidAmount: 200000,
    balanceAmount: 140000,
    paymentMethod: "cash",
    status: "partially_paid",
    itemCount: 3,
  },
  {
    id: "sale-003",
    saleNumber: "SAL-2026-003",
    customerName: "Bright Homes Ltd",
    saleDate: daysAgo(1),
    totalAmount: 875000,
    paidAmount: 875000,
    balanceAmount: 0,
    paymentMethod: "bank_transfer",
    status: "completed",
    itemCount: 6,
  },
  {
    id: "sale-004",
    saleNumber: "SAL-2026-004",
    customerName: "Alice M.",
    saleDate: daysAgo(2),
    totalAmount: 185000,
    paidAmount: 0,
    balanceAmount: 185000,
    paymentMethod: "cash",
    status: "pending",
    itemCount: 2,
  },
  {
    id: "sale-005",
    saleNumber: "SAL-2026-005",
    customerName: "Prime Builders",
    saleDate: daysAgo(3),
    totalAmount: 2150000,
    paidAmount: 2150000,
    balanceAmount: 0,
    paymentMethod: "mobile_money",
    status: "completed",
    itemCount: 12,
  },
];

const topProducts: DashboardProduct[] = [
  {
    id: "prod-001",
    productName: "Premium Emulsion Paint",
    productCode: "PNT-001",
    categoryName: "Interior Paint",
    brandName: "ColorPro",
    quantitySold: 245,
    totalRevenue: 3675000,
    unitPrice: 15000,
    currentStock: 120,
    unit: "litres",
  },
  {
    id: "prod-002",
    productName: "Weather Guard Exterior",
    productCode: "PNT-002",
    categoryName: "Exterior Paint",
    brandName: "ColorPro",
    quantitySold: 180,
    totalRevenue: 4500000,
    unitPrice: 25000,
    currentStock: 65,
    unit: "litres",
  },
  {
    id: "prod-003",
    productName: "White Wall Primer",
    productCode: "PNT-003",
    categoryName: "Primers",
    brandName: "BuildMax",
    quantitySold: 145,
    totalRevenue: 1450000,
    unitPrice: 10000,
    currentStock: 18,
    unit: "litres",
  },
  {
    id: "prod-004",
    productName: "Gloss Finish Enamel",
    productCode: "PNT-004",
    categoryName: "Decorative Paint",
    brandName: "BuildMax",
    quantitySold: 112,
    totalRevenue: 1680000,
    unitPrice: 15000,
    currentStock: 9,
    unit: "litres",
  },
];

const inventoryAlerts: InventoryAlert[] = [
  {
    id: "alert-001",
    productId: "prod-003",
    productName: "White Wall Primer",
    productCode: "PNT-003",
    categoryName: "Primers",
    currentStock: 18,
    minimumStock: 25,
    reorderQuantity: 50,
    unit: "litres",
    alertLevel: "low_stock",
    warehouseName: "Main Warehouse",
    createdAt: daysAgo(0),
  },
  {
    id: "alert-002",
    productId: "prod-004",
    productName: "Gloss Finish Enamel",
    productCode: "PNT-004",
    categoryName: "Decorative Paint",
    currentStock: 9,
    minimumStock: 20,
    reorderQuantity: 40,
    unit: "litres",
    alertLevel: "low_stock",
    warehouseName: "Main Warehouse",
    createdAt: daysAgo(1),
  },
  {
    id: "alert-003",
    productId: "prod-005",
    productName: "Anti-Rust Metal Primer",
    productCode: "PNT-005",
    categoryName: "Primers",
    currentStock: 0,
    minimumStock: 15,
    reorderQuantity: 30,
    unit: "litres",
    alertLevel: "out_of_stock",
    warehouseName: "Secondary Warehouse",
    createdAt: daysAgo(1),
  },
];

const activities: DashboardActivity[] = [
  {
    id: "activity-001",
    type: "sale_created",
    title: "New sale recorded",
    description: "Sale SAL-2026-001 was recorded for Kigali Construction Ltd.",
    timestamp: daysAgo(0),
    userName: "Sales Manager",
    status: "success",
  },
  {
    id: "activity-002",
    type: "payment_received",
    title: "Payment received",
    description: "A payment of RWF 875,000 was received.",
    timestamp: daysAgo(1),
    userName: "Cashier",
    status: "success",
  },
  {
    id: "activity-003",
    type: "stock_added",
    title: "Stock updated",
    description: "New inventory was received in the main warehouse.",
    timestamp: daysAgo(2),
    userName: "Inventory Manager",
    status: "info",
  },
  {
    id: "activity-004",
    type: "customer_created",
    title: "New customer registered",
    description: "A new business customer was added.",
    timestamp: daysAgo(3),
    userName: "Administrator",
    status: "success",
  },
];

function createChartData(filters: DashboardFilters) {
  const count =
    filters.period === "daily" ? 7 :
    filters.period === "weekly" ? 8 :
    filters.period === "yearly" ? 5 : 12;

  return Array.from({ length: count }, (_, index) => {
    const revenue = 450000 + index * 85000 + (index % 3) * 120000;
    const sales = 12 + index * 2 + (index % 3) * 4;

    return {
      date: daysAgo((count - index - 1) * 2),
      label:
        filters.period === "yearly"
          ? `Year ${index + 1}`
          : filters.period === "monthly"
            ? `Month ${index + 1}`
            : `Day ${index + 1}`,
      revenue,
      previousRevenue: Math.round(revenue * 0.82),
      targetRevenue: 700000,
      sales,
      previousSales: Math.round(sales * 0.85),
    };
  });
}

export const dashboardService = {
  async getOverview(
    filters: DashboardFilters,
  ): Promise<DashboardOverviewResponse> {
    const chartData = createChartData(filters);
    const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
    const totalSales = chartData.reduce((sum, item) => sum + item.sales, 0);

    return {
      stats: {
        totalRevenue,
        totalSales,
        totalOrders: 86,
        totalCustomers: 324,
        totalProducts: 158,
        totalInventoryValue: 28450000,
        lowStockItems: 2,
        outOfStockItems: 1,
        pendingPayments: 325000,
        pendingOrders: 7,
        revenueTrend: createTrend(totalRevenue, totalRevenue * 0.88),
        salesTrend: createTrend(totalSales, totalSales * 0.92),
        ordersTrend: createTrend(86, 74),
        customersTrend: createTrend(324, 300),
      },
      revenue: {
        period: filters.period,
        data: chartData.map(({ date, label, revenue, previousRevenue, targetRevenue }) => ({
          date,
          label,
          revenue,
          previousRevenue,
          targetRevenue,
        })),
        summary: {
          currentRevenue: totalRevenue,
          previousRevenue: totalRevenue * 0.88,
          revenueChange: 13.6,
          averageRevenue: totalRevenue / chartData.length,
          highestRevenue: Math.max(...chartData.map((item) => item.revenue)),
          lowestRevenue: Math.min(...chartData.map((item) => item.revenue)),
        },
      },
      sales: {
        period: filters.period,
        data: chartData.map(({ date, label, sales, previousSales }) => ({
          date,
          label,
          sales,
          previousSales,
        })),
        summary: {
          totalSales,
          previousSales: totalSales * 0.92,
          salesChange: 8.7,
          averageSales: totalSales / chartData.length,
          highestSales: Math.max(...chartData.map((item) => item.sales)),
          lowestSales: Math.min(...chartData.map((item) => item.sales)),
        },
      },
      categorySales: [
        {
          categoryId: "cat-001",
          categoryName: "Interior Paint",
          totalSales: 245,
          totalRevenue: 3675000,
          percentage: 38,
          color: "#2563EB",
        },
        {
          categoryId: "cat-002",
          categoryName: "Exterior Paint",
          totalSales: 180,
          totalRevenue: 4500000,
          percentage: 32,
          color: "#0F766E",
        },
        {
          categoryId: "cat-003",
          categoryName: "Primers",
          totalSales: 145,
          totalRevenue: 1450000,
          percentage: 18,
          color: "#D97706",
        },
        {
          categoryId: "cat-004",
          categoryName: "Decorative Paint",
          totalSales: 112,
          totalRevenue: 1680000,
          percentage: 12,
          color: "#7C3AED",
        },
      ],
      paymentMethods: [
        {
          method: "mobile_money",
          label: "Mobile Money",
          transactionCount: 48,
          totalAmount: 8500000,
          percentage: 48,
          color: "#2563EB",
        },
        {
          method: "cash",
          label: "Cash",
          transactionCount: 35,
          totalAmount: 5200000,
          percentage: 30,
          color: "#0F766E",
        },
        {
          method: "bank_transfer",
          label: "Bank Transfer",
          transactionCount: 16,
          totalAmount: 3000000,
          percentage: 17,
          color: "#D97706",
        },
        {
          method: "card",
          label: "Card",
          transactionCount: 5,
          totalAmount: 850000,
          percentage: 5,
          color: "#7C3AED",
        },
      ],
      recentSales,
      topSellingProducts: topProducts,
      inventoryAlerts,
      recentActivities: activities,
      inventorySummary: {
        totalProducts: 158,
        totalStockQuantity: 4850,
        totalInventoryValue: 28450000,
        lowStockCount: 2,
        outOfStockCount: 1,
        reorderRequiredCount: 3,
      },
    };
  },

  async getStats(filters: DashboardFilters) {
    const overview = await this.getOverview(filters);
    return overview.stats;
  },

  async getRevenue(filters: DashboardFilters) {
    const overview = await this.getOverview(filters);
    return overview.revenue;
  },

  async getSales(filters: DashboardFilters) {
    const overview = await this.getOverview(filters);
    return overview.sales;
  },

  async getInventoryAlerts(): Promise<InventoryAlert[]> {
    return inventoryAlerts;
  },
};
