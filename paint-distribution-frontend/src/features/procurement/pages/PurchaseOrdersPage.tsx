import { Link } from "react-router-dom";
import { Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePurchaseOrders } from "../hooks/usePurchaseOrders";
import { formatProcurementCurrency } from "../utils/procurement.utils";
import { ProcurementStatusBadge } from "../components/ProcurementStatusBadge";

export function PurchaseOrdersPage() {
  const { data: orders = [], isLoading, isError } = usePurchaseOrders();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Purchase orders</h1>
          <p className="text-muted-foreground">
            Manage supplier orders and track delivery progress.
          </p>
        </div>
        <Button asChild>
          <Link to="/procurement/purchase-orders/new">
            <Plus className="mr-2 h-4 w-4" />
            Create purchase order
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-lg border p-10 text-center">
          Loading purchase orders...
        </div>
      ) : isError ? (
        <div className="rounded-lg border p-10 text-center text-destructive">
          Unable to load purchase orders.
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-lg border p-10 text-center text-muted-foreground">
          No purchase orders have been created yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Order date</TableHead>
                <TableHead>Expected delivery</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>{order.supplierName}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.expectedDeliveryDate}</TableCell>
                  <TableCell>
                    <ProcurementStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    {formatProcurementCurrency(order.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="icon" variant="ghost">
                      <Link to={`/procurement/purchase-orders/${order.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
