
import { useQuery } from "@tanstack/react-query";
import { EXPENSE_QUERY_KEYS } from "../constants/expense.constants";
import { expenseService } from "../services/expenseService";
import type { ExpenseFilters } from "../types/expense.types";

export function useExpenses(filters: ExpenseFilters) {
  return useQuery({
    queryKey: EXPENSE_QUERY_KEYS.list(filters),
    queryFn: () => expenseService.getAll(filters),
    staleTime: 60_000,
  });
}
