import type { ExpenseStatus } from "../types/expense.types";

interface ExpenseStatusBadgeProps {
  status: ExpenseStatus;
}

const styles: Record<ExpenseStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-blue-50 text-blue-700",
  rejected: "bg-red-50 text-red-700",
  paid: "bg-green-50 text-green-700",
  partially_paid: "bg-purple-50 text-purple-700",
};

const labels: Record<ExpenseStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  paid: "Paid",
  partially_paid: "Partially paid",
};

export function ExpenseStatusBadge({ status }: ExpenseStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
