import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { procurementService } from "../services/procurementService";
import { procurementKeys } from "./useProcurement";
import type {
  GoodsReceiptInput,
  ProcurementRequestInput,
  PurchaseOrderInput,
  PurchaseOrderStatus,
} from "../types/procurement.types";

export function useProcurementMutations() {
  const queryClient = useQueryClient();

  const refresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: procurementKeys.all,
    });
  };

  const createRequest = useMutation({
    mutationFn: (input: ProcurementRequestInput) =>
      procurementService.createRequest(input),
    onSuccess: async () => {
      await refresh();
      toast.success("Procurement request created");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateRequest = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: ProcurementRequestInput;
    }) => procurementService.updateRequest(id, input),
    onSuccess: async () => {
      await refresh();
      toast.success("Procurement request updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const submitRequest = useMutation({
    mutationFn: (id: string) => procurementService.submitRequest(id),
    onSuccess: async () => {
      await refresh();
      toast.success("Request submitted for approval");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const approveRequest = useMutation({
    mutationFn: (id: string) => procurementService.approveRequest(id),
    onSuccess: async () => {
      await refresh();
      toast.success("Procurement request approved");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const rejectRequest = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      procurementService.rejectRequest(id, reason),
    onSuccess: async () => {
      await refresh();
      toast.success("Procurement request rejected");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const cancelRequest = useMutation({
    mutationFn: (id: string) => procurementService.cancelRequest(id),
    onSuccess: async () => {
      await refresh();
      toast.success("Procurement request cancelled");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const createPurchaseOrder = useMutation({
    mutationFn: (input: PurchaseOrderInput) =>
      procurementService.createPurchaseOrder(input),
    onSuccess: async () => {
      await refresh();
      toast.success("Purchase order created");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updatePurchaseOrderStatus = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: PurchaseOrderStatus;
    }) => procurementService.updatePurchaseOrderStatus(id, status),
    onSuccess: async () => {
      await refresh();
      toast.success("Purchase order status updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const createGoodsReceipt = useMutation({
    mutationFn: (input: GoodsReceiptInput) =>
      procurementService.createGoodsReceipt(input),
    onSuccess: async () => {
      await refresh();
      toast.success("Goods receipt recorded");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    createRequest,
    updateRequest,
    submitRequest,
    approveRequest,
    rejectRequest,
    cancelRequest,
    createPurchaseOrder,
    updatePurchaseOrderStatus,
    createGoodsReceipt,
  };
}