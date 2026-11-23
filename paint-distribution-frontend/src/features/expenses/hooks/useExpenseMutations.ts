
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EXPENSE_QUERY_KEYS } from "../constants/expense.constants";
import { expenseService } from "../services/expenseService";
import type {
  ExpenseFormValues,
  ExpensePaymentValues,
} from "../types/expense.types";

export function useExpenseMutations() {
  const queryClient = useQueryClient();

  const invalidateExpenses = async () => {
    await queryClient.invalidateQueries({
      queryKey: EXPENSE_QUERY_KEYS.all,
    });
  };

  const createExpense = useMutation({
    mutationFn: (values: ExpenseFormValues) =>
      expenseService.create(values),
    onSuccess: invalidateExpenses,
  });

  const updateExpense = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: ExpenseFormValues;
    }) => expenseService.update(id, values),
    onSuccess: async (expense) => {
      queryClient.setQueryData(
        EXPENSE_QUERY_KEYS.detail(expense.id),
        expense,
      );
      await invalidateExpenses();
    },
  });

  const deleteExpense = useMutation({
    mutationFn: (id: string) => expenseService.remove(id),
    onSuccess: invalidateExpenses,
  });

  const approveExpense = useMutation({
    mutationFn: (id: string) => expenseService.approve(id),
    onSuccess: async (expense) => {
      queryClient.setQueryData(
        EXPENSE_QUERY_KEYS.detail(expense.id),
        expense,
      );
      await invalidateExpenses();
    },
  });

  const rejectExpense = useMutation({
    mutationFn: (id: string) => expenseService.reject(id),
    onSuccess: async (expense) => {
      queryClient.setQueryData(
        EXPENSE_QUERY_KEYS.detail(expense.id),
        expense,
      );
      await invalidateExpenses();
    },
  });

  const recordPayment = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: ExpensePaymentValues;
    }) => expenseService.recordPayment(id, values),
    onSuccess: async (expense) => {
      queryClient.setQueryData(
        EXPENSE_QUERY_KEYS.detail(expense.id),
        expense,
      );
      await invalidateExpenses();
    },
  });

  return {
    createExpense,
    updateExpense,
    deleteExpense,
    approveExpense,
    rejectExpense,
    recordPayment,
  };
}
