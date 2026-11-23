import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { StockStatusBadge } from "../components";
import { useLowStock } from "../hooks/useInventory";
import { formatCurrency } from "../utils/inventory.utils";

export function LowStockPage() {
  const { data: items = [], isLoading, error } = useLowStock();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/inventory">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold">Low stock alerts</h1>
          <p className="text-sm text-muted-foreground">
            Inventory items that need attention or replenishment.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="rounded-lg bg-yellow-100 p-3 text-yellow-700">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Items requiring attention
            </p>
            <p className="text-2xl font-bold">
              {isLoading ? "..." : items.length}
            </p>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <p className="rounded-lg border p-6 text-sm text-destructive">
          Unable to load low-stock records.
        </p>
      ) : isLoading ? (
        <p className="rounded-lg border p-8 text-center text-muted-foreground">
          Loading low-stock items...
        </p>
      ) : items.length === 0 ? (
        <div className="rounded-lg border p-10 text-center">
          <p className="font-medium">All stock levels look good.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No low-stock or out-of-stock items were found.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <h3 className="font-semibold">{item.productName}</h3>
                  <p className="text-xs text-muted-foreground">
                    {item.productSku} · {item.warehouseName}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Minimum stock: {item.minimumQuantity} {item.unit}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Current quantity
                    </p>
                    <p className="font-semibold">
                      {item.quantity} {item.unit}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Stock value</p>
                    <p className="font-semibold">
                      {formatCurrency(item.quantity * item.unitCost)}
                    </p>
                  </div>

                  <StockStatusBadge status={item.status} />

                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/inventory/${item.id}`}>View details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
