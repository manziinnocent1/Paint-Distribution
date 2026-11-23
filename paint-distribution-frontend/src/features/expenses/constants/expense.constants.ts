
import type {
  ExpenseCategory,
  ExpensePaymentMethod,
  ExpenseStatus,
  ExpenseFilters,
} from "../types/expense.types";

export const EXPENSE_CATEGORIES: {
  value: ExpenseCategory;
  label: string;
}[] = [
  { value: "rent", label: "Rent" },
  { value: "utilities", label: "Utilities" },
  { value: "transport", label: "Transport" },
  { value: "salaries", label: "Salaries" },
  { value: "office_supplies", label: "Office supplies" },
  { value: "maintenance", label: "Maintenance" },
  { value: "marketing", label: "Marketing" },
  { value: "taxes", label: "Taxes" },
  { value: "insurance", label: "Insurance" },
  { value: "communication", label: "Communication" },
  { value: "other", label: "Other" },
];

export const EXPENSE_STATUSES: {
  value: ExpenseStatus;
  label: string;
}[] = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending approval" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "paid", label: "Paid" },
  { value: "partially_paid", label: "Partially paid" },
];

export const EXPENSE_PAYMENT_METHODS: {
  value: ExpensePaymentMethod;
  label: string;
}[] = [
  { value: "cash", label: "Cash" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "card", label: "Card" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
];

export const DEFAULT_EXPENSE_FILTERS: ExpenseFilters = {
  search: "",
  category: "all",
  status: "all",
  paymentMethod: "all",
  startDate: "",
  endDate: "",
  ordering: "newest",
  page: 1,
  pageSize: 10,
};

export const EXPENSE_QUERY_KEYS = {
  all: ["expenses"] as const,
  lists: () => ["expenses", "list"] as const,
  list: (filters: ExpenseFilters) =>
    ["expenses", "list", filters] as const,
  details: () => ["expenses", "detail"] as const,
  detail: (id: string) => ["expenses", "detail", id] as const,
  stats: () => ["expenses", "stats"] as const,
};
