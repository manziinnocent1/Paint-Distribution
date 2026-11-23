import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePurchaseOrder } from "../hooks/usePurchaseOrders";
import { useProcurementMutations } from "../hooks/useProcurementMutations";
import { ProcurementStatusBadge } from "../components/ProcurementStatusBadge";
import { ProcurementItemsTable } from "../components/ProcurementItemsTable";
import {
  formatProcurementCurrency,
  getPurchaseOrderReceivedQuantity,
  getPurchaseOrderRemainingQuantity,
} from "../utils/procurement.utils";
import type { PurchaseOrderStatus } from "../types/procurement.types";
import { PURCHASE_ORDER_STATUSES } from "../constants/procurement.constants";

export function PurchaseOrderDetailsPage() {
  const { id = "" } = useParams();
  const { data: order, isLoading, isError } = usePurchaseOrder(id);
  const { updatePurchaseOrderStatus } = useProcurementMutations();

  if (isLoading) {
    return <div className="p-8 text-center">Loading purchase order...</div>;
  }

  if (isError || !order) {
    return (
      <div className="rounded-lg border p-8 text-center text-destructive">
        Purchase order not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost">
        <Link to="/procurement/purchase-orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to purchase orders
        </Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{order.orderNumber}</p>
          <h1 className="mt-1 text-2xl font-bold">Purchase order details</h1>
          <p className="mt-1 text-muted-foreground">{order.supplierName}</p>
        </div>

        <ProcurementStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Order date</p>
                <p className="font-medium">{order.orderDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Expected delivery
                </p>
                <p className="font-medium">{order.expectedDeliveryDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Supplier</p>
                <p className="font-medium">{order.supplierName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Related procurement request
                </p>
                <p className="font-medium">
                  {order.procurementRequestNumber ?? "Not linked"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order items</CardTitle>
            </CardHeader>
            <CardContent>
              <ProcurementItemsTable items={order.items} mode="order" />
              <div className="mt-5 space-y-2 border-t pt-4 text-right">
                <p className="text-sm text-muted-foreground">
                  Subtotal: {formatProcurementCurrency(order.subtotal)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Tax: {formatProcurementCurrency(order.tax)}
                </p>
                <p className="text-xl font-bold">
                  Total: {formatProcurementCurrency(order.total)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Receiving progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Accepted quantity received
                  </p>
                  <p className="text-2xl font-bold">
                    {getPurchaseOrderReceivedQuantity(order)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Remaining quantity
                  </p>
                  <p className="text-2xl font-bold">
                    {getPurchaseOrderRemainingQuantity(order)}
                  </p>
                </div>
              </div>

              <Button
                asChild
                className="mt-5"
                disabled={
                  ["received", "cancelled"].includes(order.status) ||
                  getPurchaseOrderRemainingQuantity(order) === 0
                }
              >
                <Link to="/procurement/goods-receipts/new">
                  <Truck className="mr-2 h-4 w-4" />
                  Record goods receipt
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Update order status</p>
              <Select
                value={order.status}
                onValueChange={(value) =>
                  updatePurchaseOrderStatus.mutate({
                    id: order.id,
                    status: value as PurchaseOrderStatus,
                  })
                }
                disabled={updatePurchaseOrderStatus.isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PURCHASE_ORDER_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {order.notes && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium">Order notes</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {order.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
