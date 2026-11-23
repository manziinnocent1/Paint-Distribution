export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "refunded";

export type PaymentMethod =
  | "cash"
  | "mobile_money"
  | "card"
  | "bank_transfer";

export type PaymentProvider =
  | "paypack"
  | "mtn_momo"
  | "airtel_money"
  | "stripe"
  | "manual";

export type PaymentDirection = "incoming" | "outgoing";

export interface Payment {
  id: string;
  paymentNumber: string;
  orderId?: string;
  orderNumber?: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  provider: PaymentProvider;
  status: PaymentStatus;
  direction: PaymentDirection;
  transactionReference?: string;
  providerReference?: string;
  description?: string;
  failureReason?: string;
  refundReason?: string;
  refundedAmount?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  refundedAt?: string;
}

export interface PaymentFilters {
  search?: string;
  status?: PaymentStatus | "all";
  method?: PaymentMethod | "all";
  provider?: PaymentProvider | "all";
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  completedAmount: number;
  pendingAmount: number;
  refundedAmount: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
  refundedCount: number;
}

export interface CreatePaymentInput {
  customerId: string;
  customerName: string;
  customerEmail?: string;
  orderId?: string;
  orderNumber?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  provider: PaymentProvider;
  description?: string;
  transactionReference?: string;
}

export interface RefundPaymentInput {
  reason: string;
  amount?: number;
}

export interface PaymentListResponse {
  results: Payment[];
  count: number;
  page: number;
  pageSize: number;
}

export interface PaymentTimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  status: PaymentStatus;
}