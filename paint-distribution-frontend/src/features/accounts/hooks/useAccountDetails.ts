
import { useCallback, useEffect, useState } from "react";

import { accountService } from "../services/accountService";
import type { Account } from "../types/account.types";

interface UseAccountDetailsReturn {
  account: Account | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateAccount: (
    data: Partial<Account>
  ) => Promise<Account>;
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
    "Unable to load account information."
  );
}

export function useAccountDetails(
  accountId?: string
): UseAccountDetailsReturn {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(Boolean(accountId));
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!accountId) {
      setAccount(null);
      setLoading(false);
      setError("An account ID is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await accountService.getAccount(accountId);
      setAccount(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateAccount = async (
    data: Partial<Account>
  ): Promise<Account> => {
    if (!accountId) {
      throw new Error("An account ID is required.");
    }

    const updated = await accountService.updateAccount(
      accountId,
      data
    );

    setAccount(updated);

    return updated;
  };

  return {
    account,
    loading,
    error,
    refresh,
    updateAccount,
  };
}
