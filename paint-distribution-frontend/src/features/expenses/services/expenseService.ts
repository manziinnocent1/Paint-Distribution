
import type {
  Expense,
  ExpenseFilters,
  ExpenseFormValues,
  ExpensePaymentValues,
  ExpenseCategorySummary,
  ExpenseStats,
  PaginatedExpenses,
} from "../types/expense.types";
import { EXPENSE_CATEGORIES } from "../constants/expense.constants";

const now = new Date();

function dateDaysAgo(days: number): string {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

let expenses: Expense[] = [
  {
    id: "exp-001",
    expenseNumber: "EXP-2026-001",
    title: "Warehouse monthly rent",
    description: "Monthly rent for the main paint warehouse.",
    category: "rent",
    amount: 850000,
    paidAmount: 850000,
    remainingAmount: 0,
    expenseDate: dateDaysAgo(2),
    dueDate: dateDaysAgo(2),
    status: "paid",
    paymentMethod: "bank_transfer",
    vendorName: "Kigali Properties Ltd",
    referenceNumber: "TRX-10001",
    createdBy: "Admin",
    approvedBy: "Finance Manager",
    approvedAt: dateDaysAgo(2),
    paidAt: dateDaysAgo(2),
    createdAt: dateDaysAgo(2),
    updatedAt: dateDaysAgo(2),
  },
  {
    id: "exp-002",
    expenseNumber: "EXP-2026-002",
    title: "Electricity bill",
    description: "Electricity for office and warehouse.",
    category: "utilities",
    amount: 185000,
    paidAmount: 0,
    remainingAmount: 185000,
    expenseDate: dateDaysAgo(1),
    dueDate: dateDaysAgo(-5),
    status: "pending",
    paymentMethod: "mobile_money",
    vendorName: "Utility Provider",
    createdBy: "Operations Manager",
    createdAt: dateDaysAgo(1),
    updatedAt: dateDaysAgo(1),
  },
  {
    id: "exp-003",
    expenseNumber: "EXP-2026-003",
    title: "Delivery fuel",
    description: "Fuel for delivery vehicles.",
    category: "transport",
    amount: 120000,
    paidAmount: 60000,
    remainingAmount: 60000,
    expenseDate: dateDaysAgo(3),
    status: "partially_paid",
    paymentMethod: "cash",
    vendorName: "City Fuel Station",
    createdBy: "Operations Manager",
    createdAt: dateDaysAgo(3),
    updatedAt: dateDaysAgo(1),
  },
  {
    id: "exp-004",
    expenseNumber: "EXP-2026-004",
    title: "Office stationery",
    description: "Paper, pens, printer ink and other supplies.",
    category: "office_supplies",
    amount: 75000,
    paidAmount: 0,
    remainingAmount: 75000,
    expenseDate: dateDaysAgo(4),
    status: "approved",
    vendorName: "Office Supplies Rwanda",
    createdBy: "Administrator",
    approvedBy: "Finance Manager",
    approvedAt: dateDaysAgo(3),
    createdAt: dateDaysAgo(4),
    updatedAt: dateDaysAgo(3),
  },
  {
    id: "exp-005",
    expenseNumber: "EXP-2026-005",
    title: "Vehicle maintenance",
    description: "Routine servicing of the delivery motorcycle.",
    category: "maintenance",
    amount: 95000,
    paidAmount: 0,
    remainingAmount: 95000,
    expenseDate: dateDaysAgo(6),
    status: "rejected",
    vendorName: "Auto Service Centre",
    createdBy: "Delivery Manager",
    createdAt: dateDaysAgo(6),
    updatedAt: dateDaysAgo(5),
  },
  {
    id: "exp-006",
    expenseNumber: "EXP-2026-006",
    title: "Social media promotion",
    description: "Advertising campaign for new paint products.",
    category: "marketing",
    amount: 210000,
    paidAmount: 210000,
    remainingAmount: 0,
    expenseDate: dateDaysAgo(8),
    status: "paid",
    paymentMethod: "mobile_money",
    vendorName: "Digital Marketing Agency",
    createdBy: "Marketing Manager",
    approvedBy: "Finance Manager",
    approvedAt: dateDaysAgo(7),
    paidAt: dateDaysAgo(7),
    createdAt: dateDaysAgo(8),
    updatedAt: dateDaysAgo(7),
  },
];

function toExpense(
  values: ExpenseFormValues,
  id: string,
  expenseNumber: string,
  existing?: Expense,
): Expense {
  const timestamp = new Date().toISOString();

  return {
    id,
    expenseNumber,
    title: values.title,
    description: values.description,
    category: values.category,
    amount: values.amount,
    paidAmount: existing?.paidAmount ?? 0,
    remainingAmount: Math.max(
      0,
      values.amount - (existing?.paidAmount ?? 0),
    ),
    expenseDate: values.expenseDate,
    dueDate: values.dueDate || undefined,
    status: existing?.status ?? "pending",
    paymentMethod: values.paymentMethod || undefined,
    vendorName: values.vendorName || undefined,
    vendorPhone: values.vendorPhone || undefined,
    referenceNumber: values.referenceNumber || undefined,
    receiptUrl: values.receiptUrl || undefined,
    notes: values.notes || undefined,
    createdBy: existing?.createdBy ?? "Current User",
    approvedBy: existing?.approvedBy,
    approvedAt: existing?.approvedAt,
    paidAt: existing?.paidAt,
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
}

function calculateStats(items: Expense[]): ExpenseStats {
  return {
    totalExpenses: items.length,
    totalAmount: items.reduce((sum, item) => sum + item.amount, 0),
    paidAmount: items.reduce((sum, item) => sum + item.paidAmount, 0),
    outstandingAmount: items.reduce(
      (sum, item) => sum + item.remainingAmount,
      0,
    ),
    pendingCount: items.filter((item) => item.status === "pending").length,
    approvedCount: items.filter((item) => item.status === "approved").length,
    rejectedCount: items.filter((item) => item.status === "rejected").length,
    paidCount: items.filter((item) => item.status === "paid").length,
  };
}

function calculateCategorySummary(
  items: Expense[],
): ExpenseCategorySummary[] {
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return EXPENSE_CATEGORIES.map((category) => {
    const matching = items.filter(
      (item) => item.category === category.value,
    );
    const amount = matching.reduce((sum, item) => sum + item.amount, 0);

    return {
      category: category.value,
      label: category.label,
      amount,
      count: matching.length,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    };
  }).filter((item) => item.count > 0);
}

function matchesDate(value: string, start: string, end: string): boolean {
  const date = value.slice(0, 10);
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
}

export const expenseService = {
  async getAll(filters: ExpenseFilters): Promise<{
    results: Expense[];
    count: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    let result = [...expenses];

    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();

      result = result.filter((expense) =>
        [
          expense.expenseNumber,
          expense.title,
          expense.description ?? "",
          expense.vendorName ?? "",
        ].some((value) => value.toLowerCase().includes(query)),
      );
    }

    if (filters.category !== "all") {
      result = result.filter((item) => item.category === filters.category);
    }

    if (filters.status !== "all") {
      result = result.filter((item) => item.status === filters.status);
    }

    if (filters.paymentMethod !== "all") {
      result = result.filter(
        (item) => item.paymentMethod === filters.paymentMethod,
      );
    }

    result = result.filter((item) =>
      matchesDate(item.expenseDate, filters.startDate, filters.endDate),
    );

    result.sort((a, b) => {
      switch (filters.ordering) {
        case "oldest":
          return a.expenseDate.localeCompare(b.expenseDate);
        case "amount_high":
          return b.amount - a.amount;
        case "amount_low":
          return a.amount - b.amount;
        default:
          return b.expenseDate.localeCompare(a.expenseDate);
      }
    });

    const count = result.length;
    const pageSize = Math.max(1, filters.pageSize);
    const totalPages = Math.ceil(count / pageSize);
    const page = Math.min(Math.max(1, filters.page), Math.max(1, totalPages));
    const start = (page - 1) * pageSize;

    return {
      results: result.slice(start, start + pageSize),
      count,
      page,
      pageSize,
      totalPages,
    };
  },

  async getById(id: string): Promise<Expense> {
    const expense = expenses.find((item) => item.id === id);

    if (!expense) {
      throw new Error("Expense not found.");
    }

    return { ...expense };
  },

  async getStats(): Promise<ExpenseStats> {
    return calculateStats(expenses);
  },

  async getCategorySummary(): Promise<ExpenseCategorySummary[]> {
    return calculateCategorySummary(expenses);
  },

  async create(values: ExpenseFormValues): Promise<Expense> {
    const id = `exp-${crypto.randomUUID()}`;
    const expenseNumber = `EXP-${new Date().getFullYear()}-${String(
      expenses.length + 1,
    ).padStart(3, "0")}`;

    const expense = toExpense(values, id, expenseNumber);
    expenses = [expense, ...expenses];

    return expense;
  },

  async update(
    id: string,
    values: ExpenseFormValues,
  ): Promise<Expense> {
    const existing = expenses.find((item) => item.id === id);

    if (!existing) throw new Error("Expense not found.");
    if (existing.status === "paid") {
      throw new Error("Paid expenses cannot be edited.");
    }

    const updated = toExpense(
      values,
      existing.id,
      existing.expenseNumber,
      existing,
    );

    expenses = expenses.map((item) => item.id === id ? updated : item);
    return updated;
  },

  async remove(id: string): Promise<void> {
    const existing = expenses.find((item) => item.id === id);

    if (!existing) throw new Error("Expense not found.");
    if (existing.status === "paid") {
      throw new Error("Paid expenses cannot be deleted.");
    }

    expenses = expenses.filter((item) => item.id !== id);
  },

  async approve(id: string): Promise<Expense> {
    const existing = await this.getById(id);

    if (existing.status !== "pending") {
      throw new Error("Only pending expenses can be approved.");
    }

    const updated: Expense = {
      ...existing,
      status: "approved",
      approvedBy: "Current User",
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expenses = expenses.map((item) => item.id === id ? updated : item);
    return updated;
  },

  async reject(id: string): Promise<Expense> {
    const existing = await this.getById(id);

    if (existing.status !== "pending") {
      throw new Error("Only pending expenses can be rejected.");
    }

    const updated: Expense = {
      ...existing,
      status: "rejected",
      updatedAt: new Date().toISOString(),
    };

    expenses = expenses.map((item) => item.id === id ? updated : item);
    return updated;
  },

  async recordPayment(
    id: string,
    values: ExpensePaymentValues,
  ): Promise<Expense> {
    const existing = await this.getById(id);

    if (!["approved", "partially_paid"].includes(existing.status)) {
      throw new Error("Only approved expenses can receive payments.");
    }

    if (values.amount > existing.remainingAmount) {
      throw new Error("Payment cannot exceed the outstanding balance.");
    }

    const paidAmount = existing.paidAmount + values.amount;
    const remainingAmount = Math.max(0, existing.amount - paidAmount);

    const updated: Expense = {
      ...existing,
      paidAmount,
      remainingAmount,
      paymentMethod: values.paymentMethod,
      referenceNumber: values.referenceNumber || existing.referenceNumber,
      status: remainingAmount === 0 ? "paid" : "partially_paid",
      paidAt: remainingAmount === 0
        ? new Date().toISOString()
        : existing.paidAt,
      updatedAt: new Date().toISOString(),
    };

    expenses = expenses.map((item) => item.id === id ? updated : item);
    return updated;
  },
};
