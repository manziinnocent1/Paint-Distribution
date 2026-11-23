
export type ExpenseStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "paid"
  | "partially_paid";

export type ExpenseCategory =
  | "rent"
  | "utilities"
  | "transport"
  | "salaries"
  | "office_supplies"
  | "maintenance"
  | "marketing"
  | "taxes"
  | "insurance"
  | "communication"
  | "other";

export type ExpensePaymentMethod =
  | "cash"
  | "mobile_money"
  | "bank_transfer"
  | "card"
  | "cheque"
  | "other";

export interface Expense {
  id: string;
  expenseNumber: string;
  title: string;
  description?: string;
  category: ExpenseCategory;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  expenseDate: string;
  dueDate?: string;
  status: ExpenseStatus;
  paymentMethod?: ExpensePaymentMethod;
  vendorName?: string;
  vendorPhone?: string;
  referenceNumber?: string;
  receiptUrl?: string;
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormValues {
  title: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  expenseDate: string;
  dueDate: string;
  vendorName: string;
  vendorPhone: string;
  referenceNumber: string;
  paymentMethod: ExpensePaymentMethod | "";
  notes: string;
  receiptUrl: string;
}

export interface ExpensePaymentValues {
  amount: number;
  paymentMethod: ExpensePaymentMethod;
  paymentDate: string;
  referenceNumber?: string;
  notes?: string;
}

export interface ExpenseFilters {
  search: string;
  category: ExpenseCategory | "all";
  status: ExpenseStatus | "all";
  paymentMethod: ExpensePaymentMethod | "all";
  startDate: string;
  endDate: string;
  ordering: "newest" | "oldest" | "amount_high" | "amount_low";
  page: number;
  pageSize: number;
}

export interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  paidCount: number;
}

export interface ExpenseCategorySummary {
  category: ExpenseCategory;
  label: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface PaginatedExpenses {
  results: Expense[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ExpenseListResponse {
  expenses: PaginatedExpenses;
  stats: ExpenseStats;
  categorySummary: ExpenseCategorySummary[];
}

export interface ExpenseQueryParams {
  search?: string;
  category?: ExpenseCategory | "all";
  status?: ExpenseStatus | "all";
  paymentMethod?: ExpensePaymentMethod | "all";
  startDate?: string;
  endDate?: string;
  ordering?: ExpenseFilters["ordering"];
  page?: number;
  pageSize?: number;
}
