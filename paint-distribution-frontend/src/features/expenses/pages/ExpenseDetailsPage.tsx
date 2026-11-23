import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { ExpenseDetails } from "../components/ExpenseDetails";
import { useExpense } from "../hooks/useExpense";
import { useExpenseMutations } from "../hooks/useExpenseMutations";
import type {
  ExpensePaymentMethod,
  ExpensePaymentValues,
} from "../types/expense.types";
import { getCurrentDateInputValue } from "../utils/expense.utils";

export function ExpenseDetailsPage() {
  const { id = "" } = useParams<{ id: string }>();
  const { data: expense, isLoading, isError } = useExpense(id);

  const { approveExpense, rejectExpense, recordPayment } =
    useExpenseMutations();

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<ExpensePaymentMethod>("cash");
  const [paymentDate, setPaymentDate] = useState(getCurrentDateInputValue());
  const [referenceNumber, setReferenceNumber] = useState("");

  const isProcessing =
    approveExpense.isPending ||
    rejectExpense.isPending ||
    recordPayment.isPending;

  const handleApprove = async () => {
    if (!window.confirm("Approve this expense?")) return;

    try {
      await approveExpense.mutateAsync(id);
      toast.success("Expense approved.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to approve expense.",
      );
    }
  };

  const handleReject = async () => {
    if (!window.confirm("Reject this expense?")) return;

    try {
      await rejectExpense.mutateAsync(id);
      toast.success("Expense rejected.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to reject expense.",
      );
    }
  };

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!expense) return;

    const amount = Number(paymentAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid payment amount.");
      return;
    }

    const values: ExpensePaymentValues = {
      amount,
      paymentMethod,
      paymentDate,
      referenceNumber,
    };

    try {
      await recordPayment.mutateAsync({ id, values });
      toast.success("Payment recorded successfully.");
      setShowPaymentForm(false);
      setPaymentAmount("");
      setReferenceNumber("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to record payment.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-slate-100" />
        <div className="h-64 rounded-xl bg-slate-100" />
        <div className="h-64 rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (isError || !expense) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
      >
        Expense not found or could not be loaded.
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 pb-8">
      <ExpenseDetails
        expense={expense}
        onApprove={handleApprove}
        onReject={handleReject}
        onRecordPayment={() => setShowPaymentForm(true)}
        isProcessing={isProcessing}
      />

      {showPaymentForm && (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900">Record payment</h2>
          <p className="mt-1 text-sm text-slate-500">
            Outstanding balance:{" "}
            {new Intl.NumberFormat("en-RW", {
              style: "currency",
              currency: "RWF",
              maximumFractionDigits: 0,
            }).format(expense.remainingAmount)}
          </p>

          <form onSubmit={handlePayment} className="mt-5 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Payment amount (RWF)
              <input
                type="number"
                min="1"
                max={expense.remainingAmount}
                step="1"
                required
                value={paymentAmount}
                onChange={(event) => setPaymentAmount(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Payment method
              <select
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(event.target.value as ExpensePaymentMethod)
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
              >
                <option value="cash">Cash</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="bank_transfer">Bank transfer</option>
                <option value="card">Card</option>
                <option value="cheque">Cheque</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Payment date
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(event) => setPaymentDate(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Transaction reference
              <input
                value={referenceNumber}
                onChange={(event) => setReferenceNumber(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
                placeholder="Optional reference"
              />
            </label>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isProcessing ? "Recording..." : "Record payment"}
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}

export default ExpenseDetailsPage;
