import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { toast } from "sonner";

import { ExpenseForm } from "../components/ExpenseForm";
import { useExpense } from "../hooks/useExpense";
import { useExpenseMutations } from "../hooks/useExpenseMutations";
import type { ExpenseFormValues } from "../types/expense.types";

export function EditExpensePage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: expense, isLoading, isError } = useExpense(id);
  const { updateExpense } = useExpenseMutations();

  const handleSubmit = async (values: ExpenseFormValues) => {
    try {
      await updateExpense.mutateAsync({ id, values });
      toast.success("Expense updated successfully.");
      navigate(`/expenses/${id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update expense.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-slate-100" />
        <div className="h-80 rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (isError || !expense) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
      >
        Unable to find this expense.{" "}
        <Link to="/expenses" className="font-semibold underline">
          Return to expenses
        </Link>
      </div>
    );
  }

  if (expense.status === "paid") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        Paid expenses cannot be edited.{" "}
        <Link to={`/expenses/${id}`} className="font-semibold underline">
          View expense
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 pb-8">
      <Link
        to={`/expenses/${id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft size={16} />
        Back to expense details
      </Link>

      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
          <Pencil size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit expense</h1>
          <p className="mt-1 text-sm text-slate-500">
            Update {expense.expenseNumber}.
          </p>
        </div>
      </div>

      <ExpenseForm
        initialValues={expense}
        onSubmit={handleSubmit}
        isSubmitting={updateExpense.isPending}
        submitLabel="Save changes"
      />
    </main>
  );
}

export default EditExpensePage;
