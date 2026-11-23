import { Link } from "react-router-dom";
import { Eye, ArrowUpDown } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { StockStatusBadge } from "./StockStatusBadge";

import type { StockItem } from "../types/inventory.types";
import { formatCurrency, formatDate } from "../utils/inventory.utils";

interface Props {
  items: StockItem[];
  onSort?: (ordering: string) => void;
  ordering?: string;
}

export function StockTable({ items, onSort, ordering }: Props) {
  if (!items.length) {
    return (
      <div className="rounded-lg border py-12 text-center text-sm text-muted-foreground">
        No inventory records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead>
              <button
                type="button"
                className="inline-flex items-center gap-1"
                onClick={() =>
                  onSort?.(ordering === "quantity" ? "-quantity" : "quantity")
                }
              >
                Quantity
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
            </TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Stock value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last updated</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="font-medium">{item.productName}</div>
                <div className="text-xs text-muted-foreground">
                  {item.variantName}
                </div>
              </TableCell>

              <TableCell>{item.productSku}</TableCell>

              <TableCell>{item.warehouseName}</TableCell>

              <TableCell>
                {item.quantity} {item.unit}
              </TableCell>

              <TableCell>
                {Math.max(0, item.quantity - item.reservedQuantity)} {item.unit}
              </TableCell>

              <TableCell>
                {formatCurrency(item.quantity * item.unitCost)}
              </TableCell>

              <TableCell>
                <StockStatusBadge status={item.status} />
              </TableCell>

              <TableCell>{formatDate(item.lastUpdated)}</TableCell>

              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/inventory/${item.id}`}>
                    <Eye className="mr-1 h-4 w-4" />
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
