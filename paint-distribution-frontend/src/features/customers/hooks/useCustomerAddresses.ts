
import { useQuery } from "@tanstack/react-query";

import { customerService } from "../services/customerService";
import { CUSTOMER_QUERY_KEYS } from "./useCustomers";

export function useCustomerAddresses(customerId?: string) {
  return useQuery({
    queryKey: CUSTOMER_QUERY_KEYS.addresses(customerId ?? ""),
    queryFn: () =>
      customerService.getCustomerAddresses(customerId!),
    enabled: Boolean(customerId),
  });
}
