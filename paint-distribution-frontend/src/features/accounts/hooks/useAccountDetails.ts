
import { useCallback, useEffect, useState } from "react";

import { accountService } from "../services/accountService";
import type {
  Account,
  UpdateAccountRequest,
} from "../types/account.types";

interface UseAccountDetailsReturn {
  account: Account | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateAccount: (
    data: UpdateAccountRequest
  ) => Promise<Account>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const apiError = error as Error & {
      response?: {
        data?: {
          detail?: string;
          message?: string;
        };
      };
    };

    return (
      apiError.response?.data?.detail ||
      apiError.response?.data?.message ||
      apiError.message ||
      "Unable to process account information."
    );
  }

  return "An unexpected error occurred.";
}

export function useAccountDetails(
  accountId?: string
): UseAccountDetailsReturn {
  const [account, setAccount] = useState<Account | null>(null);

  const [loading, setLoading] = useState(Boolean(accountId));

  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
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
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateAccount = useCallback(
    async (
      data: UpdateAccountRequest
    ): Promise<Account> => {
      if (!accountId) {
        throw new Error("An account ID is required.");
      }

      try {
        setError(null);

        const updated = await accountService.updateAccount(
          accountId,
          data
        );

        setAccount(updated);

        return updated;
      } catch (err: unknown) {
        const message = getErrorMessage(err);

        setError(message);

        throw err;
      }
    },
    [accountId]
  );

  return {
    account,
    loading,
    error,
    refresh,
    updateAccount,
  };
}
