import { Badge } from "@/components/ui/badge";
import type { SalePaymentStatus, SaleStatus } from "../types/sales.types";
import {
  getSalePaymentStatusLabel,
  getSaleStatusLabel,
} from "../utils/sales.utils";

const statusStyles: Record<SaleStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  processing:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const paymentStyles: Record<SalePaymentStatus, string> = {
  unpaid: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  partially_paid:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  refunded: "bg-muted text-muted-foreground",
};

export function SalesStatusBadge({ status }: { status: SaleStatus }) {
  return (
    <Badge variant="outline" className={statusStyles[status]}>
      {getSaleStatusLabel(status)}
    </Badge>
  );
}

export function SalesPaymentBadge({ status }: { status: SalePaymentStatus }) {
  return (
    <Badge variant="outline" className={paymentStyles[status]}>
      {getSalePaymentStatusLabel(status)}
    </Badge>
  );
}
