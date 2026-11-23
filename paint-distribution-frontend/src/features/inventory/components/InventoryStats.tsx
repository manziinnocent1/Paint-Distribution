import {
  Boxes,
  Warehouse,
  AlertTriangle,
  PackageX,
  Banknote,
  Layers3,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "../utils/inventory.utils";
import type { InventoryStats as InventoryStatsType } from "../types/inventory.types";

interface Props {
  stats?: InventoryStatsType;
  isLoading?: boolean;
}

export function InventoryStats({ stats, isLoading }: Props) {
  const items = [
    {
      title: "Product records",
      value: stats?.totalProducts ?? 0,
      icon: Boxes,
      description: "Tracked stock items",
    },
    {
      title: "Total quantity",
      value: stats?.totalQuantity ?? 0,
      icon: Layers3,
      description: "Units across warehouses",
    },
    {
      title: "Stock value",
      value: formatCurrency(stats?.totalStockValue ?? 0),
      icon: Banknote,
      description: "Based on recorded unit costs",
    },
    {
      title: "Low stock",
      value: stats?.lowStockItems ?? 0,
      icon: AlertTriangle,
      description: "Items requiring replenishment",
    },
    {
      title: "Out of stock",
      value: stats?.outOfStockItems ?? 0,
      icon: PackageX,
      description: "Items with zero quantity",
    },
    {
      title: "Active warehouses",
      value: stats?.activeWarehouses ?? 0,
      icon: Warehouse,
      description: "Currently active locations",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title}>
            <CardContent className="flex items-start justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{item.title}</p>

                <p className="mt-2 text-2xl font-bold">
                  {isLoading ? "..." : item.value}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
