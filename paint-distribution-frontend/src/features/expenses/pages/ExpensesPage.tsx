import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Receipt, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import {
  DEFAULT_EXPENSE_FILTERS,
  EXPENSE_QUERY_KEYS,
} from "../constants/expense.constants";
import { ExpenseFilters } from "../components/ExpenseFilters";
import { ExpenseStats } from "../components/ExpenseStats";
import { ExpenseTable } from "../components/ExpenseTable";
import { useExpenses } from "../hooks/useExpenses";
import { useExpenseMutations } from "../hooks/useExpenseMutations";
import { expenseService } from "../services/expenseService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Expense,
  ExpenseFilters as ExpenseFiltersType,
} from "../types/expense.types";

export function ExpensesPage() {
  const [filters, setFilters] = useState<ExpenseFiltersType>(
    DEFAULT_EXPENSE_FILTERS,
  );

  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch, isFetching } =
    useExpenses(filters);

  const { data: stats } = useQuery({
    queryKey: EXPENSE_QUERY_KEYS.stats(),
    queryFn: () => expenseService.getStats(),
    staleTime: 60_000,
  });

  const { deleteExpense } = useExpenseMutations();

  const handleDelete = async (expense: Expense) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${expense.title}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteExpense.mutateAsync(expense.id);
      toast.success("Expense deleted successfully.");
      await queryClient.invalidateQueries({
        queryKey: EXPENSE_QUERY_KEYS.stats(),
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete expense.",
      );
    }
  };

  return (
    <main className="space-y-6 pb-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="text-blue-600" size={23} />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Expenses
            </h1>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Manage, monitor, and track your business expenses.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>

          <Link
            to="/expenses/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Add expense
          </Link>
        </div>
      </div>

      {stats && <ExpenseStats stats={stats} />}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="font-semibold text-slate-900">Expense records</h2>
          <p className="mt-1 text-sm text-slate-500">
            Search, filter, and manage recorded expenses.
          </p>
        </div>

        <ExpenseFilters filters={filters} onChange={setFilters} />

        <div className="mt-5">
          {isLoading ? (
            <div className="space-y-3 py-5" aria-label="Loading expenses">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-14 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>
          ) : isError ? (
            <div
              role="alert"
              className="rounded-lg bg-red-50 p-5 text-sm text-red-700"
            >
              Unable to load expenses.{" "}
              <button
                type="button"
                onClick={() => void refetch()}
                className="font-semibold underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <ExpenseTable
                expenses={data?.results ?? []}
                onDelete={handleDelete}
              />

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <p className="text-sm text-slate-500">
                  Showing {data?.results.length ?? 0} of {data?.count ?? 0}{" "}
                  expenses
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!data || data.page <= 1}
                    onClick={() =>
                      setFilters((current) => ({
                        ...current,
                        page: Math.max(1, current.page - 1),
                      }))
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-slate-600">
                    Page {data?.page ?? 1} of {data?.totalPages ?? 1}
                  </span>

                  <button
                    type="button"
                    disabled={!data || data.page >= data.totalPages}
                    onClick={() =>
                      setFilters((current) => ({
                        ...current,
                        page: current.page + 1,
                      }))
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default ExpensesPage;
