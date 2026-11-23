import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { Payment } from "../types/payment.types";
import { formatPaymentAmount, formatPaymentDate } from "../utils/payment.utils";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { PaymentMethodBadge } from "./PaymentMethodBadge";

interface Props {
  payments: Payment[];
}

export function PaymentTable({ payments }: Props) {
  if (!payments.length) {
    return (
      <div className="rounded-lg border p-10 text-center text-sm text-muted-foreground">
        No payments found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                <div className="font-medium">{payment.paymentNumber}</div>
                <div className="text-xs text-muted-foreground">
                  {payment.transactionReference || "No reference"}
                </div>
              </TableCell>

              <TableCell>
                <div className="font-medium">{payment.customerName}</div>
                <div className="text-xs text-muted-foreground">
                  {payment.customerEmail || "—"}
                </div>
              </TableCell>

              <TableCell>{payment.orderNumber || "—"}</TableCell>

              <TableCell>
                <PaymentMethodBadge method={payment.method} />
              </TableCell>

              <TableCell className="font-medium">
                {formatPaymentAmount(payment.amount, payment.currency)}
              </TableCell>

              <TableCell>
                <PaymentStatusBadge status={payment.status} />
              </TableCell>

              <TableCell>{formatPaymentDate(payment.createdAt)}</TableCell>

              <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/payments/${payment.id}`}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View payment</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
