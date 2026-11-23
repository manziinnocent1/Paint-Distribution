import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import type { Payment } from "../types/payment.types";
import { formatPaymentAmount, formatPaymentDate } from "../utils/payment.utils";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { PaymentMethodBadge } from "./PaymentMethodBadge";

export function PaymentCard({ payment }: { payment: Payment }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0 space-y-2">
          <div className="font-semibold">{payment.paymentNumber}</div>
          <div className="truncate text-sm text-muted-foreground">
            {payment.customerName}
          </div>
          <div className="flex flex-wrap gap-2">
            <PaymentStatusBadge status={payment.status} />
            <PaymentMethodBadge method={payment.method} />
          </div>
          <div className="text-xs text-muted-foreground">
            {formatPaymentDate(payment.createdAt)}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="font-bold">
            {formatPaymentAmount(payment.amount, payment.currency)}
          </div>
          <Button variant="ghost" size="sm" asChild className="mt-2">
            <Link to={`/payments/${payment.id}`}>
              View <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
