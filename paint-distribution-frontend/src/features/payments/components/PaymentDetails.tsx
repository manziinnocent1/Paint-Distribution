import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { Payment } from "../types/payment.types";
import {
  formatPaymentAmount,
  formatPaymentDate,
  getPaymentProviderLabel,
} from "../utils/payment.utils";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import { PaymentProviderBadge } from "./PaymentProviderBadge";
import { PaymentTimeline } from "./PaymentTimeline";
import { PaymentRefundDialog } from "./PaymentRefundDialog";

export function PaymentDetails({ payment }: { payment: Payment }) {
  const [refundOpen, setRefundOpen] = useState(false);

  const fields = [
    ["Payment number", payment.paymentNumber],
    ["Customer", payment.customerName],
    ["Customer email", payment.customerEmail || "—"],
    ["Order number", payment.orderNumber || "—"],
    ["Transaction reference", payment.transactionReference || "—"],
    ["Provider reference", payment.providerReference || "—"],
    ["Payment method", null],
    ["Payment provider", null],
    ["Created", formatPaymentDate(payment.createdAt)],
    ["Last updated", formatPaymentDate(payment.updatedAt)],
    ["Completed", formatPaymentDate(payment.completedAt)],
  ] as const;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Payment overview</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {payment.paymentNumber}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PaymentStatusBadge status={payment.status} />
            {payment.status === "completed" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRefundOpen(true)}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Refund
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Payment amount</p>
            <p className="text-3xl font-bold">
              {formatPaymentAmount(payment.amount, payment.currency)}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                {label === "Payment method" ? (
                  <div className="mt-1">
                    <PaymentMethodBadge method={payment.method} />
                  </div>
                ) : label === "Payment provider" ? (
                  <div className="mt-1">
                    <PaymentProviderBadge provider={payment.provider} />
                  </div>
                ) : (
                  <p className="mt-1 break-words text-sm font-medium">
                    {value}
                  </p>
                )}
              </div>
            ))}
          </div>

          {payment.description && (
            <div>
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="mt-1 text-sm">{payment.description}</p>
            </div>
          )}

          {payment.failureReason && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <p className="font-semibold">Failure reason</p>
              <p>{payment.failureReason}</p>
            </div>
          )}

          {payment.status === "refunded" && (
            <div className="rounded-md border border-purple-200 bg-purple-50 p-3 text-sm text-purple-800">
              <p className="font-semibold">Refund information</p>
              <p>
                Refunded amount:{" "}
                {formatPaymentAmount(
                  payment.refundedAmount ?? payment.amount,
                  payment.currency,
                )}
              </p>
              <p>Reason: {payment.refundReason || "—"}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment activity</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentTimeline
            events={[
              {
                id: `${payment.id}-created`,
                title: "Payment created",
                description: "The payment record was created.",
                date: payment.createdAt,
                status: "pending",
              },
              ...(payment.completedAt
                ? [
                    {
                      id: `${payment.id}-completed`,
                      title: "Payment completed",
                      description: "Payment was successfully received.",
                      date: payment.completedAt,
                      status: "completed" as const,
                    },
                  ]
                : []),
              ...(payment.refundedAt
                ? [
                    {
                      id: `${payment.id}-refunded`,
                      title: "Payment refunded",
                      description: payment.refundReason,
                      date: payment.refundedAt,
                      status: "refunded" as const,
                    },
                  ]
                : []),
              ...(payment.status === "failed"
                ? [
                    {
                      id: `${payment.id}-failed`,
                      title: "Payment failed",
                      description: payment.failureReason,
                      date: payment.updatedAt,
                      status: "failed" as const,
                    },
                  ]
                : []),
            ]}
          />
        </CardContent>
      </Card>

      <PaymentRefundDialog
        payment={payment}
        open={refundOpen}
        onOpenChange={setRefundOpen}
      />
    </div>
  );
}
