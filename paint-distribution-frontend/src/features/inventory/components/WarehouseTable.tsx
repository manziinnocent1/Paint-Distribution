import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Pencil } from "lucide-react";
import type { Warehouse } from "../types/inventory.types";

interface Props {
  warehouses: Warehouse[];
  onEdit: (warehouse: Warehouse) => void;
}

export function WarehouseTable({ warehouses, onEdit }: Props) {
  if (!warehouses.length) {
    return (
      <div className="rounded-lg border py-10 text-center text-sm text-muted-foreground">
        No warehouses have been created.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Stock records</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {warehouses.map((warehouse) => (
            <TableRow key={warehouse.id}>
              <TableCell className="font-medium">{warehouse.name}</TableCell>
              <TableCell>{warehouse.code}</TableCell>
              <TableCell>
                {warehouse.address}, {warehouse.city}
              </TableCell>
              <TableCell>{warehouse.managerName || "—"}</TableCell>
              <TableCell>{warehouse.totalProducts}</TableCell>
              <TableCell>{warehouse.totalQuantity}</TableCell>
              <TableCell>
                <Badge
                  className={
                    warehouse.status === "active"
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                  }
                >
                  {warehouse.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(warehouse)}
                >
                  <Pencil className="mr-1 h-4 w-4" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
