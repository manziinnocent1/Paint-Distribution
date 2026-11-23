import type {
  CreateSaleInput,
  RecordSalePaymentInput,
  Sale,
  SaleItem,
  SaleTimelineEvent,
  SalesFilters,
  SalesListResponse,
  SalesStats,
  UpdateSaleInput,
} from "../types/sales.types";
import {
  calculateSaleItem,
  calculateSaleTotals,
  getPaymentStatus,
  getSaleBalance,
} from "../utils/sales.utils";

const now = new Date().toISOString();

const createItem = (
  id: string,
  productId: string,
  productName: string,
  productSku: string,
  quantity: number,
  unitPrice: number,
): SaleItem => {
  const calculations = calculateSaleItem({
    quantity,
    unitPrice,
    discountPercentage: 0,
    taxPercentage: 18,
  });

  return {
    id,
    productId,
    productName,
    productSku,
    quantity,
    unitPrice,
    discountPercentage: 0,
    taxPercentage: 18,
    ...calculations,
  };
};

const initialSales: Sale[] = [
  {
    id: "sale-001",
    saleNumber: "SAL-2026-0001",
    customer: {
      id: "customer-001",
      name: "Kigali Construction Ltd",
      email: "procurement@example.com",
      phone: "+250788000001",
      address: "Kigali, Rwanda",
    },
    items: [
      createItem("item-001", "product-001", "Interior Emulsion Paint", "INT-001", 10, 25000),
      createItem("item-002", "product-002", "White Primer", "PRI-001", 5, 18000),
    ],
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "mobile_money",
    saleDate: "2026-11-20",
    expectedDeliveryDate: "2026-11-22",
    completedAt: "2026-11-22T10:00:00.000Z",
    subtotal: 340000,
    discountAmount: 0,
    taxAmount: 61200,
    total: 401200,
    amountPaid: 401200,
    balanceDue: 0,
    currency: "RWF",
    notes: "Deliver to the customer's construction site.",
    createdBy: "Sales Administrator",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "sale-002",
    saleNumber: "SAL-2026-0002",
    customer: {
      id: "customer-002",
      name: "Amahoro Hardware",
      phone: "+250788000002",
      address: "Gasabo, Kigali",
    },
    items: [
      createItem("item-003", "product-003", "Exterior Paint", "EXT-001", 8, 32000),
    ],
    status: "processing",
    paymentStatus: "partially_paid",
    paymentMethod: "cash",
    saleDate: "2026-11-22",
    expectedDeliveryDate: "2026-11-26",
    subtotal: 256000,
    discountAmount: 0,
    taxAmount: 46080,
    total: 302080,
    amountPaid: 150000,
    balanceDue: 152080,
    currency: "RWF",
    createdBy: "Sales Administrator",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "sale-003",
    saleNumber: "SAL-2026-0003",
    customer: {
      id: "customer-003",
      name: "Individual Customer",
      phone: "+250788000003",
    },
    items: [
      createItem("item-004", "product-004", "Wall Putty", "PUT-001", 3, 12000),
    ],
    status: "pending",
    paymentStatus: "unpaid",
    saleDate: "2026-11-23",
    subtotal: 36000,
    discountAmount: 0,
    taxAmount: 6480,
    total: 42480,
    amountPaid: 0,
    balanceDue: 42480,
    currency: "RWF",
    createdBy: "Sales Administrator",
    createdAt: now,
    updatedAt: now,
  },
];

let sales: Sale[] = [...initialSales];

const timelineEvents: SaleTimelineEvent[] = initialSales.map((sale) => ({
  id: `event-${sale.id}`,
  saleId: sale.id,
  title: "Sale created",
  description: `${sale.saleNumber} was created.`,
  date: sale.createdAt,
  user: sale.createdBy,
  type: "created",
}));

const wait = (ms = 250) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function makeId(): string {
  return globalThis.crypto?.randomUUID?.() ??
    `sale-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function buildSaleItems(input: CreateSaleInput): SaleItem[] {
  return input.items.map((item) => {
    const calculations = calculateSaleItem(item);

    return {
      ...item,
      id: makeId(),
      ...calculations,
    };
  });
}

function addTimelineEvent(
  saleId: string,
  title: string,
  type: SaleTimelineEvent["type"],
  description?: string,
) {
  timelineEvents.unshift({
    id: makeId(),
    saleId,
    title,
    description,
    date: new Date().toISOString(),
    user: "Current User",
    type,
  });
}

function matchesFilters(sale: Sale, filters: SalesFilters): boolean {
  const search = filters.search?.trim().toLowerCase();

  if (
    search &&
    ![
      sale.saleNumber,
      sale.customer.name,
      sale.customer.email ?? "",
      sale.customer.phone ?? "",
    ].some((value) => value.toLowerCase().includes(search))
  ) {
    return false;
  }

  if (filters.status && sale.status !== filters.status) return false;

  if (
    filters.paymentStatus &&
    sale.paymentStatus !== filters.paymentStatus
  ) {
    return false;
  }

  if (filters.customerId && sale.customer.id !== filters.customerId) {
    return false;
  }

  if (filters.dateFrom && sale.saleDate < filters.dateFrom) return false;
  if (filters.dateTo && sale.saleDate > filters.dateTo) return false;

  return true;
}

export const salesService = {
  async getSales(
    filters: SalesFilters = {},
    page = 1,
    pageSize = 10,
  ): Promise<SalesListResponse> {
    await wait();

    const filtered = sales
      .filter((sale) => matchesFilters(sale, filters))
      .sort((a, b) => b.saleDate.localeCompare(a.saleDate));

    const start = (page - 1) * pageSize;

    return {
      results: filtered.slice(start, start + pageSize),
      count: filtered.length,
      page,
      pageSize,
    };
  },

  async getSale(id: string): Promise<Sale | undefined> {
    await wait();
    return sales.find((sale) => sale.id === id);
  },

  async getStats(): Promise<SalesStats> {
    await wait();

    const completed = sales.filter((sale) => sale.status === "completed");
    const outstanding = sales.reduce(
      (sum, sale) => sum + sale.balanceDue,
      0,
    );

    return {
      totalSales: sales.length,
      totalRevenue: completed.reduce((sum, sale) => sum + sale.total, 0),
      completedSales: completed.length,
      pendingSales: sales.filter((sale) =>
        ["draft", "pending", "confirmed", "processing"].includes(sale.status),
      ).length,
      cancelledSales: sales.filter((sale) => sale.status === "cancelled").length,
      outstandingBalance: outstanding,
      averageSaleValue: sales.length
        ? sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length
        : 0,
      paidSales: sales.filter((sale) => sale.paymentStatus === "paid").length,
    };
  },

  async getTimeline(id: string): Promise<SaleTimelineEvent[]> {
    await wait();

    return timelineEvents
      .filter((event) => event.saleId === id)
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  async createSale(input: CreateSaleInput): Promise<Sale> {
    await wait();

    const items = buildSaleItems(input);
    const totals = calculateSaleTotals(items);
    const amountPaid = Math.min(input.amountPaid, totals.total);

    const sale: Sale = {
      id: makeId(),
      saleNumber: `SAL-${new Date().getFullYear()}-${String(
        sales.length + 1,
      ).padStart(4, "0")}`,
      customer: input.customer,
      items,
      status: input.status,
      paymentStatus: getPaymentStatus(totals.total, amountPaid),
      paymentMethod: input.paymentMethod,
      saleDate: input.saleDate,
      expectedDeliveryDate: input.expectedDeliveryDate,
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      taxAmount: totals.taxAmount,
      total: totals.total,
      amountPaid,
      balanceDue: getSaleBalance(totals.total, amountPaid),
      currency: input.currency,
      notes: input.notes,
      termsAndConditions: input.termsAndConditions,
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    sales.unshift(sale);
    addTimelineEvent(sale.id, "Sale created", "created");

    return sale;
  },

  async updateSale(
    id: string,
    input: UpdateSaleInput,
  ): Promise<Sale> {
    await wait();

    const index = sales.findIndex((sale) => sale.id === id);

    if (index === -1) {
      throw new Error("Sale not found.");
    }

    const existing = sales[index];

    if (!["draft", "pending"].includes(existing.status)) {
      throw new Error("This sale can no longer be edited.");
    }

    const items = input.items
      ? buildSaleItems({
          ...existing,
          ...input,
          items: input.items,
        } as CreateSaleInput)
      : existing.items;

    const totals = calculateSaleTotals(items);
    const amountPaid = Math.min(
      input.amountPaid ?? existing.amountPaid,
      totals.total,
    );

    const updated: Sale = {
      ...existing,
      ...input,
      customer: input.customer ?? existing.customer,
      items,
      ...totals,
      amountPaid,
      balanceDue: getSaleBalance(totals.total, amountPaid),
      paymentStatus: getPaymentStatus(totals.total, amountPaid),
      updatedAt: new Date().toISOString(),
    };

    sales[index] = updated;
    addTimelineEvent(id, "Sale updated", "updated");

    return updated;
  },

  async updateStatus(id: string, status: Sale["status"]): Promise<Sale> {
    await wait();

    const sale = sales.find((item) => item.id === id);

    if (!sale) throw new Error("Sale not found.");

    const allowedTransitions: Record<Sale["status"], Sale["status"][]> = {
      draft: ["pending", "cancelled"],
      pending: ["confirmed", "cancelled", "draft"],
      confirmed: ["processing", "cancelled"],
      processing: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };

    if (sale.status !== status && !allowedTransitions[sale.status].includes(status)) {
      throw new Error(`Cannot change a sale from ${sale.status} to ${status}.`);
    }

    sale.status = status;
    sale.updatedAt = new Date().toISOString();

    if (status === "completed") {
      sale.completedAt = sale.updatedAt;
    }

    const titles: Record<Sale["status"], string> = {
      draft: "Sale saved as draft",
      pending: "Sale submitted",
      confirmed: "Sale confirmed",
      processing: "Sale processing started",
      completed: "Sale completed",
      cancelled: "Sale cancelled",
    };

    addTimelineEvent(id, titles[status], status === "completed" ? "completed" : status === "cancelled" ? "cancelled" : status === "confirmed" ? "confirmed" : "updated");

    return { ...sale };
  },

  async recordPayment(
    id: string,
    input: RecordSalePaymentInput,
  ): Promise<Sale> {
    await wait();

    const sale = sales.find((item) => item.id === id);

    if (!sale) throw new Error("Sale not found.");
    if (input.amount <= 0) throw new Error("Payment must be greater than zero.");
    if (input.amount > sale.balanceDue) {
      throw new Error("Payment cannot exceed the outstanding balance.");
    }

    sale.amountPaid += input.amount;
    sale.balanceDue = getSaleBalance(sale.total, sale.amountPaid);
    sale.paymentStatus = getPaymentStatus(sale.total, sale.amountPaid);
    sale.paymentMethod = input.method;
    sale.updatedAt = new Date().toISOString();

    addTimelineEvent(
      id,
      "Payment recorded",
      "updated",
      `${input.amount} ${sale.currency} received through ${input.method}.`,
    );

    return { ...sale };
  },

  async deleteSale(id: string): Promise<void> {
    await wait();

    const sale = sales.find((item) => item.id === id);

    if (!sale) throw new Error("Sale not found.");
    if (!["draft", "cancelled"].includes(sale.status)) {
      throw new Error("Only draft or cancelled sales can be deleted.");
    }

    sales = sales.filter((item) => item.id !== id);
  },
};