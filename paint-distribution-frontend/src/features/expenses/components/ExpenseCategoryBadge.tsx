import type { ExpenseCategory } from "../types/expense.types";
import { getExpenseCategoryLabel } from "../utils/expense.utils";

interface ExpenseCategoryBadgeProps {
  category: ExpenseCategory;
}

export function ExpenseCategoryBadge({ category }: ExpenseCategoryBadgeProps) {
  return (
    <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
      {getExpenseCategoryLabel(category)}
    </span>
  );
}
