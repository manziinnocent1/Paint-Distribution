import { Link } from "react-router-dom";
import { ArrowLeft, Package, Warehouse, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { StockItem } from "../types/inventory.types";
import { StockStatusBadge } from "./StockStatusBadge";
import { formatCurrency, formatDate } from "../utils/inventory.utils";

interface Props {
  stock: StockItem;
  onAdjust: () => void;
}

export function StockDetails({ stock, onAdjust }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" asChild>
          <Link to="/inventory">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to inventory
          </Link>
        </Button>

        <Button onClick={onAdjust}>Adjust stock</Button>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-start justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-4">
              <Package className="h-7 w-7 text-primary" />
            </div>

            <div>
              <h2 className="text-xl font-bold">{stock.productName}</h2>
              <p className="text-sm text-muted-foreground">
                {stock.productSku}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stock.variantName}
              </p>
            </div>
          </div>

          <StockStatusBadge status={stock.status} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total quantity",
            value: `${stock.quantity} ${stock.unit}`,
          },
          {
            label: "Reserved quantity",
            value: `${stock.reservedQuantity} ${stock.unit}`,
          },
          {
            label: "Available quantity",
            value: `${Math.max(0, stock.quantity - stock.reservedQuantity)} ${stock.unit}`,
          },
          {
            label: "Minimum quantity",
            value: `${stock.minimumQuantity} ${stock.unit}`,
          },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-2xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{stock.categoryName}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Warehouse</p>
              <p className="flex items-center gap-2 font-medium">
                <Warehouse className="h-4 w-4" />
                {stock.warehouseName}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Unit cost</p>
              <p className="font-medium">{formatCurrency(stock.unitCost)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Selling price</p>
              <p className="font-medium">
                {formatCurrency(stock.sellingPrice)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Total stock value</p>
              <p className="font-medium">
                {formatCurrency(stock.quantity * stock.unitCost)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Last updated</p>
              <p className="flex items-center gap-2 font-medium">
                <CalendarDays className="h-4 w-4" />
                {formatDate(stock.lastUpdated)}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground">Stock monitoring</p>
            <p className="mt-1 text-sm">
              Replenishment should be considered when stock reaches{" "}
              {stock.minimumQuantity} {stock.unit} or below.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
