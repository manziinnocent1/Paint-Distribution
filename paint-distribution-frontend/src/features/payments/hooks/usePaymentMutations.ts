import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "../services/paymentService";
import { paymentKeys } from "./usePayments";
import type {
  CreatePaymentInput,
  PaymentStatus,
  RefundPaymentInput,
} from "../types/payment.types";

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePaymentInput) =>
      paymentService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
    },
  });
}

export function useRefundPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: RefundPaymentInput;
    }) => paymentService.refund(id, input),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      queryClient.setQueryData(
        paymentKeys.detail(payment.id),
        payment,
      );
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: PaymentStatus;
    }) => paymentService.updateStatus(id, status),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      queryClient.setQueryData(
        paymentKeys.detail(payment.id),
        payment,
      );
    },
  });
}