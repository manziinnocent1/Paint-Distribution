import { Link } from "react-router-dom";
import type { Expense } from "../types/expense.types";
import { ExpenseStatusBadge } from "./ExpenseStatusBadge";
import { ExpenseCategoryBadge } from "./ExpenseCategoryBadge";
import {
  formatExpenseCurrency,
  formatExpenseDate,
} from "../utils/expense.utils";

interface ExpenseCardProps {
  expense: Expense;
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/expenses/${expense.id}`}
            className="font-semibold text-slate-900 hover:text-blue-600"
          >
            {expense.title}
          </Link>
          <p className="mt-1 text-xs text-slate-500">{expense.expenseNumber}</p>
        </div>
        <ExpenseStatusBadge status={expense.status} />
      </div>

      <div className="mt-3">
        <ExpenseCategoryBadge category={expense.category} />
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">Amount</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatExpenseCurrency(expense.amount)}
          </p>
        </div>
        <p className="text-xs text-slate-500">
          {formatExpenseDate(expense.expenseDate)}
        </p>
      </div>
    </article>
  );
}
