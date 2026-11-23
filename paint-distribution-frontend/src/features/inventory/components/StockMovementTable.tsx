import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { StockMovement } from "../types/inventory.types";

import { MovementTypeBadge } from "./MovementTypeBadge";
import { formatDate } from "../utils/inventory.utils";

interface Props {
  movements: StockMovement[];
}

export function StockMovementTable({ movements }: Props) {
  if (!movements.length) {
    return (
      <div className="rounded-lg border py-10 text-center text-sm text-muted-foreground">
        No stock movements found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Movement</TableHead>
            <TableHead>Previous</TableHead>
            <TableHead>Change</TableHead>
            <TableHead>New quantity</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead>Performed by</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell>{formatDate(movement.movementDate)}</TableCell>

              <TableCell>
                <div className="font-medium">{movement.productName}</div>
                <div className="text-xs text-muted-foreground">
                  {movement.productSku}
                </div>
              </TableCell>

              <TableCell>{movement.referenceNumber}</TableCell>

              <TableCell>
                <MovementTypeBadge type={movement.movementType} />
              </TableCell>

              <TableCell>{movement.previousQuantity}</TableCell>

              <TableCell>
                {movement.movementType === "stock_in"
                  ? `+${movement.quantity}`
                  : movement.movementType === "stock_out"
                    ? `-${movement.quantity}`
                    : movement.movementType === "adjustment"
                      ? movement.newQuantity - movement.previousQuantity
                      : movement.quantity}
              </TableCell>

              <TableCell className="font-semibold">
                {movement.newQuantity}
              </TableCell>

              <TableCell>{movement.warehouseName}</TableCell>

              <TableCell>{movement.performedBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
