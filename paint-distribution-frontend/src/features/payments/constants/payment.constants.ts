import type {
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
} from "../types/payment.types";

export const PAYMENT_STATUSES: {
  value: PaymentStatus;
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

export const PAYMENT_METHODS: {
  value: PaymentMethod;
  label: string;
}[] = [
  { value: "cash", label: "Cash" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

export const PAYMENT_PROVIDERS: {
  value: PaymentProvider;
  label: string;
}[] = [
  { value: "paypack", label: "Paypack" },
  { value: "mtn_momo", label: "MTN Mobile Money" },
  { value: "airtel_money", label: "Airtel Money" },
  { value: "stripe", label: "Stripe" },
  { value: "manual", label: "Manual" },
];

export const PAYMENT_CURRENCIES = [
  { value: "RWF", label: "Rwandan Franc (RWF)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
];

export const PAYMENT_PAGE_SIZE = 10;