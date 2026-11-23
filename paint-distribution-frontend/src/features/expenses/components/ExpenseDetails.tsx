import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Expense } from "../types/expense.types";
import { ExpenseStatusBadge } from "./ExpenseStatusBadge";
import { ExpenseCategoryBadge } from "./ExpenseCategoryBadge";
import { ExpensePaymentBadge } from "./ExpensePaymentBadge";
import {
  formatExpenseCurrency,
  formatExpenseDate,
  getExpensePaymentProgress,
} from "../utils/expense.utils";

interface ExpenseDetailsProps {
  expense: Expense;
  onApprove?: () => void;
  onReject?: () => void;
  onRecordPayment?: () => void;
  isProcessing?: boolean;
}

function DetailItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}

export function ExpenseDetails({
  expense,
  onApprove,
  onReject,
  onRecordPayment,
  isProcessing = false,
}: ExpenseDetailsProps) {
  const progress = getExpensePaymentProgress(expense);

  return (
    <div className="space-y-5">
      <Link
        to="/expenses"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft size={16} />
        Back to expenses
      </Link>

      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {expense.expenseNumber}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              {expense.title}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Created by {expense.createdBy}
            </p>
          </div>

          <ExpenseStatusBadge status={expense.status} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 sm:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Expense amount</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatExpenseCurrency(expense.amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Amount paid</p>
            <p className="mt-1 text-xl font-semibold text-green-600">
              {formatExpenseCurrency(expense.paidAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Outstanding balance</p>
            <p className="mt-1 text-xl font-semibold text-orange-600">
              {formatExpenseCurrency(expense.remainingAmount)}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs">
            <span className="font-medium text-slate-600">Payment progress</span>
            <span className="font-semibold text-slate-800">{progress}%</span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {expense.status === "pending" && onApprove && (
            <button
              type="button"
              onClick={onApprove}
              disabled={isProcessing}
              className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              Approve expense
            </button>
          )}

          {expense.status === "pending" && onReject && (
            <button
              type="button"
              onClick={onReject}
              disabled={isProcessing}
              className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Reject expense
            </button>
          )}

          {["approved", "partially_paid"].includes(expense.status) &&
            expense.remainingAmount > 0 &&
            onRecordPayment && (
              <button
                type="button"
                onClick={onRecordPayment}
                disabled={isProcessing}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Record payment
              </button>
            )}

          {expense.status !== "paid" && expense.status !== "rejected" && (
            <Link
              to={`/expenses/${expense.id}/edit`}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Edit expense
            </Link>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">Expense information</h2>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-slate-400">
              Category
            </p>
            <ExpenseCategoryBadge category={expense.category} />
          </div>

          <DetailItem
            label="Expense date"
            value={formatExpenseDate(expense.expenseDate)}
          />
          <DetailItem
            label="Due date"
            value={
              expense.dueDate ? formatExpenseDate(expense.dueDate) : undefined
            }
          />
          <DetailItem label="Vendor" value={expense.vendorName} />
          <DetailItem label="Vendor phone" value={expense.vendorPhone} />
          <div>
            <p className="mb-1 text-xs font-medium uppercase text-slate-400">
              Payment method
            </p>
            <ExpensePaymentBadge method={expense.paymentMethod} />
          </div>
          <DetailItem
            label="Reference number"
            value={expense.referenceNumber}
          />
          <DetailItem label="Approved by" value={expense.approvedBy} />
          <DetailItem
            label="Created"
            value={formatExpenseDate(expense.createdAt)}
          />
        </div>

        {expense.description && (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-xs font-medium uppercase text-slate-400">
              Description
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
              {expense.description}
            </p>
          </div>
        )}

        {expense.notes && (
          <div className="mt-5">
            <p className="text-xs font-medium uppercase text-slate-400">
              Internal notes
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
              {expense.notes}
            </p>
          </div>
        )}

        {expense.receiptUrl && (
          <a
            href={expense.receiptUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
          >
            View receipt <ExternalLink size={14} />
          </a>
        )}
      </section>
    </div>
  );
}
