import type { ExpensePaymentMethod } from "../types/expense.types";

interface ExpensePaymentBadgeProps {
  method?: ExpensePaymentMethod;
}

const labels: Record<ExpensePaymentMethod, string> = {
  cash: "Cash",
  mobile_money: "Mobile Money",
  bank_transfer: "Bank transfer",
  card: "Card",
  cheque: "Cheque",
  other: "Other",
};

export function ExpensePaymentBadge({ method }: ExpensePaymentBadgeProps) {
  if (!method) {
    return <span className="text-sm text-slate-400">Not recorded</span>;
  }

  return <span className="text-sm text-slate-600">{labels[method]}</span>;
}
