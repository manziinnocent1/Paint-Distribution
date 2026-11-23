import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Expense } from "../types/expense.types";
import { ExpenseStatusBadge } from "./ExpenseStatusBadge";
import { ExpenseCategoryBadge } from "./ExpenseCategoryBadge";
import {
  formatExpenseCurrency,
  formatExpenseDate,
} from "../utils/expense.utils";

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete?: (expense: Expense) => void;
  canManage?: boolean;
}

export function ExpenseTable({
  expenses,
  onDelete,
  canManage = true,
}: ExpenseTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3 font-medium">Expense</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 text-right font-medium">Amount</th>
            <th className="px-4 py-3 text-right font-medium">Paid</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((expense) => (
            <tr
              key={expense.id}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
            >
              <td className="px-4 py-4">
                <Link
                  to={`/expenses/${expense.id}`}
                  className="font-semibold text-slate-800 hover:text-blue-600"
                >
                  {expense.title}
                </Link>
                <p className="mt-1 text-xs text-slate-500">
                  {expense.expenseNumber}
                </p>
                {expense.vendorName && (
                  <p className="mt-1 text-xs text-slate-400">
                    {expense.vendorName}
                  </p>
                )}
              </td>

              <td className="px-4 py-4">
                <ExpenseCategoryBadge category={expense.category} />
              </td>

              <td className="px-4 py-4 text-slate-500">
                {formatExpenseDate(expense.expenseDate)}
              </td>

              <td className="px-4 py-4 text-right font-semibold text-slate-800">
                {formatExpenseCurrency(expense.amount)}
              </td>

              <td className="px-4 py-4 text-right text-slate-600">
                {formatExpenseCurrency(expense.paidAmount)}
              </td>

              <td className="px-4 py-4">
                <ExpenseStatusBadge status={expense.status} />
              </td>

              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <Link
                    to={`/expenses/${expense.id}`}
                    aria-label={`View ${expense.expenseNumber}`}
                    className="rounded-md p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Eye size={16} />
                  </Link>

                  {canManage && expense.status !== "paid" && (
                    <Link
                      to={`/expenses/${expense.id}/edit`}
                      aria-label={`Edit ${expense.expenseNumber}`}
                      className="rounded-md p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                    >
                      <Pencil size={16} />
                    </Link>
                  )}

                  {canManage && expense.status !== "paid" && onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(expense)}
                      aria-label={`Delete ${expense.expenseNumber}`}
                      className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {expenses.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                No expenses found. Try changing your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
