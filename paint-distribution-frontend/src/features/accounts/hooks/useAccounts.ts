
import { useCallback, useEffect, useState } from "react";

import { accountService } from "../services/accountService";

import type {
  Account,
  AccountFilters,
  AccountFormValues,
  CreateAccountRequest,
  PaginatedAccounts,
  UpdateAccountRequest,
} from "../types/account.types";

interface UseAccountsReturn {
  accounts: Account[];
  pagination: PaginatedAccounts | null;
  filters: AccountFilters;
  loading: boolean;
  error: string | null;
  setFilters: (filters: AccountFilters) => void;
  refresh: () => Promise<void>;
  createAccount: (values: AccountFormValues) => Promise<Account>;
  updateAccount: (
    id: string,
    values: AccountFormValues
  ) => Promise<Account>;
  toggleStatus: (account: Account) => Promise<Account>;
  deleteAccount: (id: string) => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  const responseError = error as {
    response?: {
      data?: {
        detail?: string;
        message?: string;
      };
    };
  };

  return (
    responseError.response?.data?.detail ||
    responseError.response?.data?.message ||
    "An unexpected error occurred. Please try again."
  );
}

export function useAccounts(): UseAccountsReturn {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [pagination, setPagination] =
    useState<PaginatedAccounts | null>(null);

  const [filters, setFiltersState] = useState<AccountFilters>({
    page: 1,
    page_size: 10,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setFilters = useCallback(
    (nextFilters: AccountFilters) => {
      setFiltersState((previous) => ({
        ...previous,
        ...nextFilters,
      }));
    },
    []
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await accountService.getAccounts(filters);

      setAccounts(result.results);
      setPagination(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createAccount = async (
    values: AccountFormValues
  ): Promise<Account> => {
    const payload: CreateAccountRequest = {
      email: values.email.trim(),
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      phone: values.phone.trim() || undefined,
      password: values.password,
      role: values.role,
    };

    const created = await accountService.createAccount(payload);

    await refresh();

    return created;
  };

  const updateAccount = async (
    id: string,
    values: AccountFormValues
  ): Promise<Account> => {
    const payload: UpdateAccountRequest = {
      email: values.email.trim(),
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      phone: values.phone.trim(),
      role: values.role,
      is_active: values.is_active,
    };

    const updated = await accountService.updateAccount(id, payload);

    await refresh();

    return updated;
  };

  const toggleStatus = async (
    account: Account
  ): Promise<Account> => {
    const updated = await accountService.setAccountStatus(
      account.id,
      !account.is_active
    );

    await refresh();

    return updated;
  };

  const deleteAccount = async (id: string): Promise<void> => {
    await accountService.deleteAccount(id);
    await refresh();
  };

  return {
    accounts,
    pagination,
    filters,
    loading,
    error,
    setFilters,
    refresh,
    createAccount,
    updateAccount,
    toggleStatus,
    deleteAccount,
  };
}
