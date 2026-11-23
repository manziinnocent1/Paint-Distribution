import { MapPin, Package, Warehouse as WarehouseIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Warehouse } from "../types/inventory.types";

interface Props {
  warehouse: Warehouse;
  onEdit: (warehouse: Warehouse) => void;
}

export function WarehouseCard({ warehouse, onEdit }: Props) {
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between">
          <div className="rounded-lg bg-primary/10 p-3">
            <WarehouseIcon className="h-5 w-5 text-primary" />
          </div>

          <Badge
            className={
              warehouse.status === "active"
                ? "bg-green-100 text-green-700 hover:bg-green-100"
                : "bg-gray-100 text-gray-700 hover:bg-gray-100"
            }
          >
            {warehouse.status}
          </Badge>
        </div>

        <div>
          <h3 className="font-semibold">{warehouse.name}</h3>
          <p className="text-xs text-muted-foreground">{warehouse.code}</p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {warehouse.address}, {warehouse.city}
          </p>

          <p className="flex items-center gap-2 text-muted-foreground">
            <Package className="h-4 w-4" />
            {warehouse.totalProducts} stock records · {warehouse.totalQuantity}{" "}
            units
          </p>
        </div>

        <button
          type="button"
          onClick={() => onEdit(warehouse)}
          className="text-sm font-medium text-primary hover:underline"
        >
          Edit warehouse
        </button>
      </CardContent>
    </Card>
  );
}
