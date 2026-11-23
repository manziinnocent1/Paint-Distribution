
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { customerService } from "../services/customerService";

import type {
  CustomerAddressPayload,
  CustomerFormValues,
} from "../types/customer.types";

import { CUSTOMER_QUERY_KEYS } from "./useCustomers";

export function useCustomerMutations() {
  const queryClient = useQueryClient();

  const invalidateCustomers = async () => {
    await queryClient.invalidateQueries({
      queryKey: CUSTOMER_QUERY_KEYS.all,
    });
  };

  const createCustomer = useMutation({
    mutationFn: (payload: CustomerFormValues) =>
      customerService.createCustomer(payload),
    onSuccess: invalidateCustomers,
  });

  const updateCustomer = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CustomerFormValues>;
    }) => customerService.updateCustomer(id, payload),
    onSuccess: async (_, variables) => {
      await invalidateCustomers();

      queryClient.invalidateQueries({
        queryKey: CUSTOMER_QUERY_KEYS.detail(variables.id),
      });
    },
  });

  const deleteCustomer = useMutation({
    mutationFn: (id: string) =>
      customerService.deleteCustomer(id),
    onSuccess: invalidateCustomers,
  });

  const updateCustomerStatus = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: CustomerFormValues["status"];
    }) => customerService.updateCustomerStatus(id, status),
    onSuccess: invalidateCustomers,
  });

  const createAddress = useMutation({
    mutationFn: (payload: CustomerAddressPayload) =>
      customerService.createCustomerAddress(payload),
    onSuccess: async (_, variables) => {
      await invalidateCustomers();

      queryClient.invalidateQueries({
        queryKey: CUSTOMER_QUERY_KEYS.addresses(
          variables.customer,
        ),
      });
    },
  });

  const updateAddress = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CustomerAddressPayload>;
    }) => customerService.updateCustomerAddress(id, payload),
    onSuccess: invalidateCustomers,
  });

  const deleteAddress = useMutation({
    mutationFn: (id: string) =>
      customerService.deleteCustomerAddress(id),
    onSuccess: invalidateCustomers,
  });

  return {
    createCustomer,
    updateCustomer,
    deleteCustomer,
    updateCustomerStatus,
    createAddress,
    updateAddress,
    deleteAddress,
  };
}
