import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Receipt } from "lucide-react";
import { Link } from "react-router-dom";

import { ExpenseForm } from "../components/ExpenseForm";
import { useExpenseMutations } from "../hooks/useExpenseMutations";
import type { ExpenseFormValues } from "../types/expense.types";

export function CreateExpensePage() {
  const navigate = useNavigate();
  const { createExpense } = useExpenseMutations();

  const handleSubmit = async (values: ExpenseFormValues) => {
    try {
      const expense = await createExpense.mutateAsync(values);
      toast.success("Expense created successfully.");
      navigate(`/expenses/${expense.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create expense.",
      );
    }
  };

  return (
    <main className="mx-auto max-w-5xl space-y-6 pb-8">
      <Link
        to="/expenses"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft size={16} />
        Back to expenses
      </Link>

      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Receipt size={23} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create expense</h1>
          <p className="mt-1 text-sm text-slate-500">
            Record a new business expense.
          </p>
        </div>
      </div>

      <ExpenseForm
        onSubmit={handleSubmit}
        isSubmitting={createExpense.isPending}
        submitLabel="Create expense"
      />
    </main>
  );
}

export default CreateExpensePage;
