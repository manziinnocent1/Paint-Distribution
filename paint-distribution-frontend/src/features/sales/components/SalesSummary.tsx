import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Sale } from "../types/sales.types";
import { formatSaleCurrency } from "../utils/sales.utils";

export function SalesSummary({ sale }: { sale: Sale }) {
  const rows = [
    { label: "Subtotal", value: sale.subtotal },
    { label: "Discount", value: -sale.discountAmount },
    { label: "Tax", value: sale.taxAmount },
    { label: "Total", value: sale.total, strong: true },
    { label: "Amount paid", value: sale.amountPaid },
    { label: "Balance due", value: sale.balanceDue, strong: true },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex justify-between gap-3 ${
              row.strong ? "border-t pt-3 font-semibold" : "text-sm"
            }`}
          >
            <span className={row.strong ? "" : "text-muted-foreground"}>
              {row.label}
            </span>
            <span>
              {formatSaleCurrency(Math.abs(row.value), sale.currency)}
              {row.value < 0 ? " discount" : ""}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
