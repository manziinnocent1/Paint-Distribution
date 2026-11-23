import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Sale } from "../types/sales.types";
import { formatSaleDate, formatSaleCurrency } from "../utils/sales.utils";
import { SalesStatusBadge, SalesPaymentBadge } from "./SalesStatusBadge";
import { SalesItemsTable } from "./SalesItemsTable";
import { SalesSummary } from "./SalesSummary";

export function SalesDetails({ sale }: { sale: Sale }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{sale.saleNumber}</p>
          <h1 className="mt-1 text-2xl font-bold">Sale details</h1>
          <p className="mt-1 text-muted-foreground">
            Created on {formatSaleDate(sale.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SalesStatusBadge status={sale.status} />
          <SalesPaymentBadge status={sale.paymentStatus} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{sale.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{sale.customer.phone || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{sale.customer.email || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{sale.customer.address || "—"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sale information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Sale date</p>
                <p className="font-medium">{formatSaleDate(sale.saleDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Expected delivery
                </p>
                <p className="font-medium">
                  {sale.expectedDeliveryDate
                    ? formatSaleDate(sale.expectedDeliveryDate)
                    : "Not scheduled"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created by</p>
                <p className="font-medium">{sale.createdBy}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment method</p>
                <p className="font-medium">
                  {sale.paymentMethod?.replace("_", " ") ?? "Not recorded"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products sold</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesItemsTable items={sale.items} />
            </CardContent>
          </Card>

          {sale.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{sale.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <SalesSummary sale={sale} />
          <Card>
            <CardHeader>
              <CardTitle>Payment information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between gap-2 text-sm">
                <span className="text-muted-foreground">Total</span>
                <span>{formatSaleCurrency(sale.total, sale.currency)}</span>
              </div>
              <div className="flex justify-between gap-2 text-sm">
                <span className="text-muted-foreground">Paid</span>
                <span>
                  {formatSaleCurrency(sale.amountPaid, sale.currency)}
                </span>
              </div>
              <div className="flex justify-between gap-2 border-t pt-3 font-semibold">
                <span>Outstanding</span>
                <span>
                  {formatSaleCurrency(sale.balanceDue, sale.currency)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
