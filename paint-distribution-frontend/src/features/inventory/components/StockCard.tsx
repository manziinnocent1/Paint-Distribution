import { Link } from "react-router-dom";
import { Eye, Package } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { StockStatusBadge } from "./StockStatusBadge";
import type { StockItem } from "../types/inventory.types";
import { formatCurrency } from "../utils/inventory.utils";

interface Props {
  stock: StockItem;
}

export function StockCard({ stock }: Props) {
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <Package className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h3 className="font-semibold">{stock.productName}</h3>
              <p className="text-xs text-muted-foreground">
                {stock.productSku}
              </p>
            </div>
          </div>

          <StockStatusBadge status={stock.status} />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Quantity</p>
            <p className="font-semibold">
              {stock.quantity} {stock.unit}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Available</p>
            <p className="font-semibold">
              {Math.max(0, stock.quantity - stock.reservedQuantity)}{" "}
              {stock.unit}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Warehouse</p>
            <p className="font-medium">{stock.warehouseName}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Stock value</p>
            <p className="font-medium">
              {formatCurrency(stock.quantity * stock.unitCost)}
            </p>
          </div>
        </div>

        <Button variant="outline" className="w-full" asChild>
          <Link to={`/inventory/${stock.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View stock details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
