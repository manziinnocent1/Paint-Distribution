import type {
  CreatePaymentInput,
  Payment,
  PaymentFilters,
  PaymentListResponse,
  PaymentStats,
  RefundPaymentInput,
} from "../types/payment.types";

const now = new Date();

const dateOffset = (days: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

let payments: Payment[] = [
  {
    id: "pay-001",
    paymentNumber: "PAY-2026-0001",
    orderId: "order-001",
    orderNumber: "ORD-2026-0001",
    customerId: "customer-001",
    customerName: "Jean Claude",
    customerEmail: "jean@example.com",
    amount: 250000,
    currency: "RWF",
    method: "mobile_money",
    provider: "mtn_momo",
    status: "completed",
    direction: "incoming",
    transactionReference: "MTN-REF-001",
    providerReference: "MTN-TXN-001",
    description: "Payment for paint order",
    createdAt: dateOffset(1),
    updatedAt: dateOffset(1),
    completedAt: dateOffset(1),
  },
  {
    id: "pay-002",
    paymentNumber: "PAY-2026-0002",
    orderId: "order-002",
    orderNumber: "ORD-2026-0002",
    customerId: "customer-002",
    customerName: "Marie Claire",
    customerEmail: "marie@example.com",
    amount: 180000,
    currency: "RWF",
    method: "cash",
    provider: "manual",
    status: "completed",
    direction: "incoming",
    transactionReference: "CASH-001",
    description: "Cash payment",
    createdAt: dateOffset(2),
    updatedAt: dateOffset(2),
    completedAt: dateOffset(2),
  },
  {
    id: "pay-003",
    paymentNumber: "PAY-2026-0003",
    orderId: "order-003",
    orderNumber: "ORD-2026-0003",
    customerId: "customer-003",
    customerName: "David Nkurunziza",
    amount: 420000,
    currency: "RWF",
    method: "mobile_money",
    provider: "airtel_money",
    status: "pending",
    direction: "incoming",
    transactionReference: "AIR-REF-003",
    createdAt: dateOffset(0),
    updatedAt: dateOffset(0),
  },
  {
    id: "pay-004",
    paymentNumber: "PAY-2026-0004",
    customerId: "customer-004",
    customerName: "Grace Uwase",
    amount: 95000,
    currency: "RWF",
    method: "card",
    provider: "stripe",
    status: "failed",
    direction: "incoming",
    failureReason: "Transaction declined by provider.",
    createdAt: dateOffset(3),
    updatedAt: dateOffset(3),
  },
  {
    id: "pay-005",
    paymentNumber: "PAY-2026-0005",
    customerId: "customer-005",
    customerName: "Patrick Mugisha",
    amount: 310000,
    currency: "RWF",
    method: "bank_transfer",
    provider: "manual",
    status: "refunded",
    direction: "incoming",
    refundedAmount: 310000,
    refundReason: "Order cancelled by customer.",
    createdAt: dateOffset(5),
    updatedAt: dateOffset(4),
    refundedAt: dateOffset(4),
  },
];

const delay = (ms = 200) =>
  new Promise((resolve) => setTimeout(resolve, ms));

class PaymentService {
  async getAll(
    filters: PaymentFilters = {},
    page = 1,
    pageSize = 10,
  ): Promise<PaymentListResponse> {
    await delay();

    let result = [...payments];

    if (filters.search) {
      const search = filters.search.toLowerCase();

      result = result.filter((payment) =>
        [
          payment.paymentNumber,
          payment.customerName,
          payment.customerEmail,
          payment.orderNumber,
          payment.transactionReference,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(search)),
      );
    }

    if (filters.status && filters.status !== "all") {
      result = result.filter(
        (payment) => payment.status === filters.status,
      );
    }

    if (filters.method && filters.method !== "all") {
      result = result.filter(
        (payment) => payment.method === filters.method,
      );
    }

    if (filters.provider && filters.provider !== "all") {
      result = result.filter(
        (payment) => payment.provider === filters.provider,
      );
    }

    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();

      result = result.filter(
        (payment) =>
          new Date(payment.createdAt).getTime() >= start,
      );
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);

      result = result.filter(
        (payment) =>
          new Date(payment.createdAt).getTime() <= end.getTime(),
      );
    }

    if (filters.minAmount !== undefined) {
      result = result.filter(
        (payment) => payment.amount >= filters.minAmount!,
      );
    }

    if (filters.maxAmount !== undefined) {
      result = result.filter(
        (payment) => payment.amount <= filters.maxAmount!,
      );
    }

    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );

    const count = result.length;
    const startIndex = (page - 1) * pageSize;

    return {
      results: result.slice(startIndex, startIndex + pageSize),
      count,
      page,
      pageSize,
    };
  }

  async getById(id: string): Promise<Payment> {
    await delay();

    const payment = payments.find((item) => item.id === id);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    return { ...payment };
  }

  async getStats(): Promise<PaymentStats> {
    await delay();

    const incoming = payments.filter(
      (payment) => payment.direction === "incoming",
    );

    return {
      totalPayments: incoming.length,
      totalAmount: incoming.reduce(
        (sum, payment) => sum + payment.amount,
        0,
      ),
      completedAmount: incoming
        .filter((payment) => payment.status === "completed")
        .reduce((sum, payment) => sum + payment.amount, 0),
      pendingAmount: incoming
        .filter((payment) => payment.status === "pending")
        .reduce((sum, payment) => sum + payment.amount, 0),
      refundedAmount: incoming
        .filter((payment) => payment.status === "refunded")
        .reduce(
          (sum, payment) =>
            sum + (payment.refundedAmount ?? payment.amount),
          0,
        ),
      completedCount: incoming.filter(
        (payment) => payment.status === "completed",
      ).length,
      pendingCount: incoming.filter(
        (payment) => payment.status === "pending",
      ).length,
      failedCount: incoming.filter(
        (payment) => payment.status === "failed",
      ).length,
      refundedCount: incoming.filter(
        (payment) => payment.status === "refunded",
      ).length,
    };
  }

  async create(input: CreatePaymentInput): Promise<Payment> {
    await delay();

    const timestamp = new Date().toISOString();

    const payment: Payment = {
      ...input,
      id: crypto.randomUUID(),
      paymentNumber: `PAY-${new Date().getFullYear()}-${String(
        payments.length + 1,
      ).padStart(4, "0")}`,
      status: "pending",
      direction: "incoming",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    payments = [payment, ...payments];

    return { ...payment };
  }

  async refund(
    id: string,
    input: RefundPaymentInput,
  ): Promise<Payment> {
    await delay();

    const index = payments.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error("Payment not found.");
    }

    const payment = payments[index];

    if (payment.status !== "completed") {
      throw new Error("Only completed payments can be refunded.");
    }

    const refundAmount = input.amount ?? payment.amount;

    if (refundAmount > payment.amount) {
      throw new Error("Refund cannot exceed the payment amount.");
    }

    const updated: Payment = {
      ...payment,
      status: "refunded",
      refundedAmount: refundAmount,
      refundReason: input.reason,
      refundedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    payments[index] = updated;

    return { ...updated };
  }

  async updateStatus(
    id: string,
    status: Payment["status"],
  ): Promise<Payment> {
    await delay();

    const index = payments.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error("Payment not found.");
    }

    const timestamp = new Date().toISOString();

    const updated: Payment = {
      ...payments[index],
      status,
      updatedAt: timestamp,
      ...(status === "completed" ? { completedAt: timestamp } : {}),
    };

    payments[index] = updated;

    return { ...updated };
  }
}

export const paymentService = new PaymentService();