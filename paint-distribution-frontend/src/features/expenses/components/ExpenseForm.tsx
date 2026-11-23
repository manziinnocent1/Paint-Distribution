import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_PAYMENT_METHODS,
} from "../constants/expense.constants";
import type { Expense, ExpenseFormValues } from "../types/expense.types";
import { getCurrentDateInputValue } from "../utils/expense.utils";

interface ExpenseFormProps {
  initialValues?: Expense;
  onSubmit: (values: ExpenseFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

function createInitialValues(expense?: Expense): ExpenseFormValues {
  return {
    title: expense?.title ?? "",
    description: expense?.description ?? "",
    category: expense?.category ?? "other",
    amount: expense?.amount ?? 0,
    expenseDate:
      expense?.expenseDate.slice(0, 10) ?? getCurrentDateInputValue(),
    dueDate: expense?.dueDate?.slice(0, 10) ?? "",
    vendorName: expense?.vendorName ?? "",
    vendorPhone: expense?.vendorPhone ?? "",
    referenceNumber: expense?.referenceNumber ?? "",
    paymentMethod: expense?.paymentMethod ?? "",
    notes: expense?.notes ?? "",
    receiptUrl: expense?.receiptUrl ?? "",
  };
}

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export function ExpenseForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save expense",
}: ExpenseFormProps) {
  const [values, setValues] = useState<ExpenseFormValues>(() =>
    createInitialValues(initialValues),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues(createInitialValues(initialValues));
  }, [initialValues]);

  const update = <K extends keyof ExpenseFormValues>(
    field: K,
    value: ExpenseFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};

    if (values.title.trim().length < 2) {
      nextErrors.title = "Enter an expense title.";
    }

    if (!values.category) {
      nextErrors.category = "Select an expense category.";
    }

    if (!Number.isFinite(values.amount) || values.amount <= 0) {
      nextErrors.amount = "Enter an amount greater than zero.";
    }

    if (!values.expenseDate) {
      nextErrors.expenseDate = "Select the expense date.";
    }

    if (
      values.dueDate &&
      values.expenseDate &&
      values.dueDate < values.expenseDate
    ) {
      nextErrors.dueDate = "Due date cannot be before expense date.";
    }

    if (initialValues && values.amount < initialValues.paidAmount) {
      nextErrors.amount =
        "Amount cannot be lower than the amount already paid.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      ...values,
      title: values.title.trim(),
      amount: Number(values.amount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">Expense information</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter the basic information about this business expense.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700">
              Expense title *
              <input
                value={values.title}
                onChange={(e) => update("title", e.target.value)}
                className={inputClass}
                placeholder="e.g. Warehouse rent"
                required
              />
            </label>
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Category *
              <select
                value={values.category}
                onChange={(e) =>
                  update(
                    "category",
                    e.target.value as ExpenseFormValues["category"],
                  )
                }
                className={inputClass}
              >
                {EXPENSE_CATEGORIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Amount (RWF) *
              <input
                type="number"
                min="1"
                step="1"
                value={values.amount || ""}
                onChange={(e) => update("amount", Number(e.target.value))}
                className={inputClass}
                placeholder="Enter amount"
                required
              />
            </label>
            {errors.amount && (
              <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Expense date *
              <input
                type="date"
                value={values.expenseDate}
                onChange={(e) => update("expenseDate", e.target.value)}
                className={inputClass}
                required
              />
            </label>
            {errors.expenseDate && (
              <p className="mt-1 text-xs text-red-600">{errors.expenseDate}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Due date
              <input
                type="date"
                min={values.expenseDate}
                value={values.dueDate}
                onChange={(e) => update("dueDate", e.target.value)}
                className={inputClass}
              />
            </label>
            {errors.dueDate && (
              <p className="mt-1 text-xs text-red-600">{errors.dueDate}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700">
              Description
              <textarea
                rows={3}
                value={values.description}
                onChange={(e) => update("description", e.target.value)}
                className={inputClass}
                placeholder="Describe the expense..."
              />
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">Vendor and payment</h2>
        <p className="mt-1 text-sm text-slate-500">
          Add supplier and payment details where available.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Vendor name
            <input
              value={values.vendorName}
              onChange={(e) => update("vendorName", e.target.value)}
              className={inputClass}
              placeholder="Vendor or supplier name"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Vendor phone
            <input
              value={values.vendorPhone}
              onChange={(e) => update("vendorPhone", e.target.value)}
              className={inputClass}
              placeholder="Phone number"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Payment method
            <select
              value={values.paymentMethod}
              onChange={(e) =>
                update(
                  "paymentMethod",
                  e.target.value as ExpenseFormValues["paymentMethod"],
                )
              }
              className={inputClass}
            >
              <option value="">Not recorded</option>
              {EXPENSE_PAYMENT_METHODS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Reference number
            <input
              value={values.referenceNumber}
              onChange={(e) => update("referenceNumber", e.target.value)}
              className={inputClass}
              placeholder="Transaction or invoice reference"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">Supporting information</h2>

        <div className="mt-4 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Receipt URL
            <input
              type="url"
              value={values.receiptUrl}
              onChange={(e) => update("receiptUrl", e.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
            <span className="mt-1 block text-xs font-normal text-slate-400">
              Enter a receipt link. File upload will be connected to the backend
              storage service later.
            </span>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Internal notes
            <textarea
              rows={3}
              value={values.notes}
              onChange={(e) => update("notes", e.target.value)}
              className={inputClass}
              placeholder="Additional notes..."
            />
          </label>
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-3">
        <Link
          to="/expenses"
          className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
