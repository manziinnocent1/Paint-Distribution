import { CreditCard, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { SupplierPaymentSummary as PaymentSummary } from "../types/supplier.types";
import {
  formatSupplierCurrency,
  formatSupplierDate,
} from "../utils/supplier.utils";

export function SupplierPaymentSummary({
  summary,
}: {
  summary: PaymentSummary;
}) {
  const values = [
    {
      label: "Total purchases",
      value: summary.totalPurchases,
    },
    {
      label: "Total paid",
      value: summary.totalPaid,
    },
    {
      label: "Outstanding balance",
      value: summary.outstandingBalance,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Payment summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {values.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4"
          >
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="font-semibold">
              {formatSupplierCurrency(item.value, summary.currency)}
            </span>
          </div>
        ))}

        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground">Last payment</p>
          <p className="mt-1 flex items-center gap-2 text-sm font-medium">
            <CreditCard className="h-4 w-4" />
            {summary.lastPaymentDate
              ? formatSupplierDate(summary.lastPaymentDate)
              : "No payments recorded"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
