
import type {
  Expense,
  ExpenseCategory,
  ExpenseStatus,
} from "../types/expense.types";
import { EXPENSE_CATEGORIES } from "../constants/expense.constants";

export function formatExpenseCurrency(amount: number): string {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatExpenseDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-RW", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getExpenseCategoryLabel(
  category: ExpenseCategory,
): string {
  return (
    EXPENSE_CATEGORIES.find((item) => item.value === category)?.label ??
    "Other"
  );
}

export function getExpenseStatusLabel(status: ExpenseStatus): string {
  const labels: Record<ExpenseStatus, string> = {
    draft: "Draft",
    pending: "Pending approval",
    approved: "Approved",
    rejected: "Rejected",
    paid: "Paid",
    partially_paid: "Partially paid",
  };

  return labels[status];
}

export function getExpenseBalance(expense: Expense): number {
  return Math.max(0, expense.amount - expense.paidAmount);
}

export function getExpensePaymentProgress(expense: Expense): number {
  if (expense.amount <= 0) return 0;

  return Math.min(
    100,
    Math.round((expense.paidAmount / expense.amount) * 100),
  );
}

export function calculateExpenseTotals(expenses: Expense[]) {
  return expenses.reduce(
    (totals, expense) => {
      totals.total += expense.amount;
      totals.paid += expense.paidAmount;
      totals.outstanding += getExpenseBalance(expense);
      return totals;
    },
    { total: 0, paid: 0, outstanding: 0 },
  );
}

export function getCurrentDateInputValue(): string {
  const date = new Date();
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().slice(0, 10);
}
