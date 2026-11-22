
import api from "@/lib/axios";

import type {
  Account,
  AccountFilters,
  CreateAccountRequest,
  PaginatedAccounts,
  UpdateAccountRequest,
} from "../types/account.types";

const BASE_URL = "/accounts/users/";

export const accountService = {
  async getAccounts(
    filters: AccountFilters = {}
  ): Promise<PaginatedAccounts> {
    const response = await api.get<PaginatedAccounts>(
      BASE_URL,
      { params: filters }
    );

    return response.data;
  },

  async getAccount(id: string): Promise<Account> {
    const response = await api.get<Account>(
      `${BASE_URL}${id}/`
    );

    return response.data;
  },

  async createAccount(
    data: CreateAccountRequest
  ): Promise<Account> {
    const response = await api.post<Account>(
      BASE_URL,
      data
    );

    return response.data;
  },

  async updateAccount(
    id: string,
    data: UpdateAccountRequest
  ): Promise<Account> {
    const response = await api.patch<Account>(
      `${BASE_URL}${id}/`,
      data
    );

    return response.data;
  },

  async setAccountStatus(
    id: string,
    is_active: boolean
  ): Promise<Account> {
    const response = await api.patch<Account>(
      `${BASE_URL}${id}/`,
      { is_active }
    );

    return response.data;
  },

  async deleteAccount(id: string): Promise<void> {
    await api.delete(`${BASE_URL}${id}/`);
  },
};
