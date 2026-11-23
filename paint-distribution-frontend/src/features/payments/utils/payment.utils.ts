import type {
  Payment,
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
  PaymentTimelineEvent,
} from "../types/payment.types";

export function formatPaymentAmount(
  amount: number,
  currency = "RWF",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "RWF" ? 0 : 2,
  }).format(amount);
}

export function formatPaymentDate(date?: string): string {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function getPaymentStatusLabel(
  status: PaymentStatus,
): string {
  const labels: Record<PaymentStatus, string> = {
    pending: "Pending",
    processing: "Processing",
    completed: "Completed",
    failed: "Failed",
    cancelled: "Cancelled",
    refunded: "Refunded",
  };

  return labels[status];
}

export function getPaymentMethodLabel(
  method: PaymentMethod,
): string {
  const labels: Record<PaymentMethod, string> = {
    cash: "Cash",
    mobile_money: "Mobile Money",
    card: "Card",
    bank_transfer: "Bank Transfer",
  };

  return labels[method];
}

export function getPaymentProviderLabel(
  provider: PaymentProvider,
): string {
  const labels: Record<PaymentProvider, string> = {
    paypack: "Paypack",
    mtn_momo: "MTN Mobile Money",
    airtel_money: "Airtel Money",
    stripe: "Stripe",
    manual: "Manual",
  };

  return labels[provider];
}

export function getPaymentTimeline(
  payment: Payment,
): PaymentTimelineEvent[] {
  const events: PaymentTimelineEvent[] = [
    {
      id: `${payment.id}-created`,
      title: "Payment created",
      description: "The payment record was created.",
      date: payment.createdAt,
      status: "pending",
    },
  ];

  if (
    payment.status === "processing" ||
    payment.status === "completed"
  ) {
    events.push({
      id: `${payment.id}-processing`,
      title: "Payment processing",
      description: "The payment is being processed.",
      date: payment.updatedAt,
      status: "processing",
    });
  }

  if (payment.completedAt) {
    events.push({
      id: `${payment.id}-completed`,
      title: "Payment completed",
      description: "The payment was successfully received.",
      date: payment.completedAt,
      status: "completed",
    });
  }

  if (payment.status === "failed") {
    events.push({
      id: `${payment.id}-failed`,
      title: "Payment failed",
      description: payment.failureReason,
      date: payment.updatedAt,
      status: "failed",
    });
  }

  if (payment.status === "cancelled") {
    events.push({
      id: `${payment.id}-cancelled`,
      title: "Payment cancelled",
      date: payment.updatedAt,
      status: "cancelled",
    });
  }

  if (payment.refundedAt) {
    events.push({
      id: `${payment.id}-refunded`,
      title: "Payment refunded",
      description: payment.refundReason,
      date: payment.refundedAt,
      status: "refunded",
    });
  }

  return events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}