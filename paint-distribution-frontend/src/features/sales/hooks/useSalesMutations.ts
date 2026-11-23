import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { salesService } from "../services/salesService";
import { SALES_QUERY_KEYS } from "../constants/sales.constants";
import type {
  CreateSaleInput,
  RecordSalePaymentInput,
  SaleStatus,
  UpdateSaleInput,
} from "../types/sales.types";

export function useSalesMutations() {
  const queryClient = useQueryClient();

  const refreshSales = async (id?: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: SALES_QUERY_KEYS.lists() }),
      queryClient.invalidateQueries({ queryKey: SALES_QUERY_KEYS.stats() }),
      ...(id
        ? [
            queryClient.invalidateQueries({
              queryKey: SALES_QUERY_KEYS.detail(id),
            }),
            queryClient.invalidateQueries({
              queryKey: SALES_QUERY_KEYS.timeline(id),
            }),
          ]
        : []),
    ]);
  };

  const createSale = useMutation({
    mutationFn: (input: CreateSaleInput) => salesService.createSale(input),
    onSuccess: async (sale) => {
      await refreshSales(sale.id);
      toast.success("Sale created successfully.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateSale = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateSaleInput;
    }) => salesService.updateSale(id, input),
    onSuccess: async (sale) => {
      await refreshSales(sale.id);
      toast.success("Sale updated successfully.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateSaleStatus = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: SaleStatus;
    }) => salesService.updateStatus(id, status),
    onSuccess: async (sale) => {
      await refreshSales(sale.id);
      toast.success("Sale status updated.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const recordPayment = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: RecordSalePaymentInput;
    }) => salesService.recordPayment(id, input),
    onSuccess: async (sale) => {
      await refreshSales(sale.id);
      toast.success("Payment recorded successfully.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteSale = useMutation({
    mutationFn: (id: string) => salesService.deleteSale(id),
    onSuccess: async () => {
      await refreshSales();
      toast.success("Sale deleted.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    createSale,
    updateSale,
    updateSaleStatus,
    recordPayment,
    deleteSale,
  };
}