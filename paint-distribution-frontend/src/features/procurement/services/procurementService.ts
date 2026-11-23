import type {
  GoodsReceipt,
  GoodsReceiptInput,
  ProcurementFilters,
  ProcurementRequest,
  ProcurementRequestInput,
  ProcurementStatsData,
  PurchaseOrder,
  PurchaseOrderInput,
  SupplierOption,
} from "../types/procurement.types";

import {
  calculateOrderSubtotal,
  calculateOrderTotal,
  calculateRequestTotal,
} from "../utils/procurement.utils";

const today = new Date().toISOString().slice(0, 10);
const futureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const suppliers: SupplierOption[] = [
  {
    id: "supplier-1",
    name: "Kigali Paint Suppliers Ltd",
    email: "sales@kigalipaint.example",
    phone: "+250 788 000 001",
  },
  {
    id: "supplier-2",
    name: "Rwanda Building Materials",
    email: "orders@rbm.example",
    phone: "+250 788 000 002",
  },
  {
    id: "supplier-3",
    name: "East Africa Industrial Supplies",
    email: "info@eais.example",
    phone: "+250 788 000 003",
  },
];

let requests: ProcurementRequest[] = [
  {
    id: "proc-1",
    requestNumber: "PR-2026-001",
    title: "Restock white emulsion paint",
    description: "Restock fast-moving white emulsion paint products.",
    requestedBy: "Inventory Manager",
    department: "Inventory",
    priority: "high",
    status: "pending",
    requiredDate: futureDate(10),
    supplierId: "supplier-1",
    supplierName: "Kigali Paint Suppliers Ltd",
    estimatedTotal: 450000,
    items: [
      {
        id: "pri-1",
        productId: "product-1",
        productName: "White Emulsion Paint",
        sku: "WEP-20L",
        quantity: 10,
        estimatedUnitPrice: 45000,
      },
    ],
    createdAt: today,
    updatedAt: today,
  },
  {
    id: "proc-2",
    requestNumber: "PR-2026-002",
    title: "Purchase painting accessories",
    description: "Purchase brushes and rollers for distribution.",
    requestedBy: "Warehouse Manager",
    department: "Warehouse",
    priority: "medium",
    status: "approved",
    requiredDate: futureDate(14),
    estimatedTotal: 180000,
    items: [
      {
        id: "pri-2",
        productId: "product-2",
        productName: "Paint Roller",
        sku: "ROL-001",
        quantity: 20,
        estimatedUnitPrice: 9000,
      },
    ],
    approvedBy: "Procurement Manager",
    approvedAt: today,
    createdAt: today,
    updatedAt: today,
  },
];

let orders: PurchaseOrder[] = [
  {
    id: "po-1",
    orderNumber: "PO-2026-001",
    procurementRequestId: "proc-2",
    procurementRequestNumber: "PR-2026-002",
    supplierId: "supplier-2",
    supplierName: "Rwanda Building Materials",
    status: "sent",
    orderDate: today,
    expectedDeliveryDate: futureDate(7),
    items: [
      {
        id: "poi-1",
        productId: "product-2",
        productName: "Paint Roller",
        sku: "ROL-001",
        quantity: 20,
        unitPrice: 9000,
        receivedQuantity: 0,
      },
    ],
    subtotal: 180000,
    tax: 32400,
    total: 212400,
    notes: "Please deliver to the main warehouse.",
    createdAt: today,
    updatedAt: today,
  },
];

let receipts: GoodsReceipt[] = [];

const wait = (ms = 150) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const makeId = () => crypto.randomUUID();

function nextNumber(prefix: string, records: { id: string }[]): string {
  return `${prefix}-${new Date().getFullYear()}-${String(records.length + 1).padStart(3, "0")}`;
}

export const procurementService = {
  async getRequests(
    filters: ProcurementFilters = {},
    page = 1,
    pageSize = 10,
  ) {
    await wait();

    let result = [...requests];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (request) =>
          request.title.toLowerCase().includes(term) ||
          request.requestNumber.toLowerCase().includes(term) ||
          request.requestedBy.toLowerCase().includes(term) ||
          request.supplierName?.toLowerCase().includes(term),
      );
    }

    if (filters.status) {
      result = result.filter((request) => request.status === filters.status);
    }

    if (filters.priority) {
      result = result.filter(
        (request) => request.priority === filters.priority,
      );
    }

    if (filters.department) {
      result = result.filter(
        (request) => request.department === filters.department,
      );
    }

    if (filters.startDate) {
      result = result.filter(
        (request) => request.createdAt >= filters.startDate!,
      );
    }

    if (filters.endDate) {
      result = result.filter(
        (request) => request.createdAt <= filters.endDate!,
      );
    }

    result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return {
      count: result.length,
      results: result.slice((page - 1) * pageSize, page * pageSize),
    };
  },

  async getRequestById(id: string) {
    await wait();
    const request = requests.find((item) => item.id === id);
    if (!request) throw new Error("Procurement request not found");
    return request;
  },

  async createRequest(input: ProcurementRequestInput) {
    await wait();

    const items = input.items.map((item) => ({
      ...item,
      id: makeId(),
    }));

    const request: ProcurementRequest = {
      ...input,
      id: makeId(),
      requestNumber: nextNumber("PR", requests),
      requestedBy: "Current User",
      status: "draft",
      items,
      estimatedTotal: calculateRequestTotal(items),
      createdAt: today,
      updatedAt: today,
    };

    requests = [request, ...requests];
    return request;
  },

  async updateRequest(id: string, input: ProcurementRequestInput) {
    await wait();

    const index = requests.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Procurement request not found");

    const existing = requests[index];

    if (!["draft", "rejected"].includes(existing.status)) {
      throw new Error("Only draft or rejected requests can be edited");
    }

    const items = input.items.map((item) => ({
      ...item,
      id: makeId(),
    }));

    const updated: ProcurementRequest = {
      ...existing,
      ...input,
      items,
      estimatedTotal: calculateRequestTotal(items),
      status: "draft",
      updatedAt: today,
      rejectionReason: undefined,
    };

    requests[index] = updated;
    return updated;
  },

  async submitRequest(id: string) {
    await wait();
    const request = requests.find((item) => item.id === id);
    if (!request) throw new Error("Procurement request not found");
    if (!["draft", "rejected"].includes(request.status)) {
      throw new Error("This request cannot be submitted");
    }

    request.status = "pending";
    request.updatedAt = today;
    return request;
  },

  async approveRequest(id: string) {
    await wait();
    const request = requests.find((item) => item.id === id);
    if (!request) throw new Error("Procurement request not found");
    if (request.status !== "pending") {
      throw new Error("Only pending requests can be approved");
    }

    request.status = "approved";
    request.approvedBy = "Current User";
    request.approvedAt = today;
    request.updatedAt = today;
    return request;
  },

  async rejectRequest(id: string, reason: string) {
    await wait();
    const request = requests.find((item) => item.id === id);
    if (!request) throw new Error("Procurement request not found");
    if (request.status !== "pending") {
      throw new Error("Only pending requests can be rejected");
    }

    request.status = "rejected";
    request.rejectionReason = reason;
    request.updatedAt = today;
    return request;
  },

  async cancelRequest(id: string) {
    await wait();
    const request = requests.find((item) => item.id === id);
    if (!request) throw new Error("Procurement request not found");

    if (["received", "cancelled"].includes(request.status)) {
      throw new Error("This request cannot be cancelled");
    }

    request.status = "cancelled";
    request.updatedAt = today;
    return request;
  },

  async getStats(): Promise<ProcurementStatsData> {
    await wait();

    return {
      totalRequests: requests.length,
      pendingRequests: requests.filter((r) => r.status === "pending").length,
      approvedRequests: requests.filter((r) => r.status === "approved").length,
      rejectedRequests: requests.filter((r) => r.status === "rejected").length,
      totalEstimatedValue: requests.reduce(
        (sum, request) => sum + request.estimatedTotal,
        0,
      ),
      activePurchaseOrders: orders.filter(
        (order) =>
          !["received", "cancelled"].includes(order.status),
      ).length,
      receivedOrders: orders.filter((order) => order.status === "received")
        .length,
    };
  },

  async getSuppliers() {
    await wait();
    return suppliers;
  },

  async getPurchaseOrders() {
    await wait();
    return [...orders].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  },

  async getPurchaseOrderById(id: string) {
    await wait();
    const order = orders.find((item) => item.id === id);
    if (!order) throw new Error("Purchase order not found");
    return order;
  },

  async createPurchaseOrder(input: PurchaseOrderInput) {
    await wait();

    if (input.procurementRequestId) {
      const request = requests.find(
        (item) => item.id === input.procurementRequestId,
      );

      if (!request || request.status !== "approved") {
        throw new Error("Purchase orders require an approved request");
      }
    }

    const items = input.items.map((item) => ({
      ...item,
      id: makeId(),
      receivedQuantity: 0,
    }));

    const subtotal = calculateOrderSubtotal(items);
    const order: PurchaseOrder = {
      ...input,
      id: makeId(),
      orderNumber: nextNumber("PO", orders),
      status: "draft",
      items,
      subtotal,
      total: calculateOrderTotal(items, input.tax),
      createdAt: today,
      updatedAt: today,
    };

    orders = [order, ...orders];

    if (input.procurementRequestId) {
      const request = requests.find(
        (item) => item.id === input.procurementRequestId,
      );
      if (request) {
        request.status = "ordered";
        request.supplierId = input.supplierId;
        request.supplierName = input.supplierName;
      }
    }

    return order;
  },

  async updatePurchaseOrderStatus(
    id: string,
    status: PurchaseOrder["status"],
  ) {
    await wait();
    const order = orders.find((item) => item.id === id);
    if (!order) throw new Error("Purchase order not found");

    order.status = status;
    order.updatedAt = today;
    return order;
  },

  async getGoodsReceipts() {
    await wait();
    return [...receipts].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  },

  async createGoodsReceipt(input: GoodsReceiptInput) {
    await wait();

    const order = orders.find(
      (item) => item.id === input.purchaseOrderId,
    );
    if (!order) throw new Error("Purchase order not found");

    const receiptItems = input.items.map((item) => ({
      ...item,
      id: makeId(),
    }));

    for (const receiptItem of receiptItems) {
      const orderItem = order.items.find(
        (item) => item.id === receiptItem.purchaseOrderItemId,
      );

      if (!orderItem) {
        throw new Error("A receipt item does not belong to this purchase order");
      }

      const remaining = orderItem.quantity - orderItem.receivedQuantity;

      if (receiptItem.receivedQuantity > remaining) {
        throw new Error(
          `Received quantity exceeds the remaining quantity for ${orderItem.productName}`,
        );
      }

      if (
        receiptItem.acceptedQuantity + receiptItem.rejectedQuantity >
        receiptItem.receivedQuantity
      ) {
        throw new Error("Accepted and rejected quantities exceed received quantity");
      }
    }

    for (const receiptItem of receiptItems) {
      const orderItem = order.items.find(
        (item) => item.id === receiptItem.purchaseOrderItemId,
      )!;

      orderItem.receivedQuantity += receiptItem.acceptedQuantity;
    }

    const allReceived = order.items.every(
      (item) => item.receivedQuantity >= item.quantity,
    );

    const anyReceived = order.items.some(
      (item) => item.receivedQuantity > 0,
    );

    order.status = allReceived
      ? "received"
      : anyReceived
        ? "partially_received"
        : order.status;

    order.updatedAt = today;

    if (order.procurementRequestId) {
      const request = requests.find(
        (item) => item.id === order.procurementRequestId,
      );

      if (request) {
        request.status = allReceived ? "received" : "partially_received";
        request.updatedAt = today;
      }
    }

    const receipt: GoodsReceipt = {
      id: makeId(),
      receiptNumber: nextNumber("GR", receipts),
      purchaseOrderId: order.id,
      purchaseOrderNumber: order.orderNumber,
      supplierName: order.supplierName,
      receivedDate: input.receivedDate,
      receivedBy: "Current User",
      status: "inspected",
      items: receiptItems,
      notes: input.notes,
      createdAt: today,
    };

    receipts = [receipt, ...receipts];
    return receipt;
  },
};