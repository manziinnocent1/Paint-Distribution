import { z } from "zod";

export const createPaymentSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  customerName: z.string().min(2, "Customer name is required"),
  customerEmail: z
    .string()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  orderId: z.string().optional(),
  orderNumber: z.string().optional(),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  currency: z.string().min(1, "Currency is required"),
  method: z.enum([
    "cash",
    "mobile_money",
    "card",
    "bank_transfer",
  ]),
  provider: z.enum([
    "paypack",
    "mtn_momo",
    "airtel_money",
    "stripe",
    "manual",
  ]),
  description: z.string().max(500).optional(),
  transactionReference: z.string().optional(),
});

export const refundPaymentSchema = z.object({
  reason: z.string().min(5, "Please provide a refund reason"),
  amount: z.coerce.number().positive().optional(),
});

export type CreatePaymentFormValues = z.infer<
  typeof createPaymentSchema
>;

export type RefundPaymentFormValues = z.infer<
  typeof refundPaymentSchema
>;