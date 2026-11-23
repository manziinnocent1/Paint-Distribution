import { Link } from "react-router-dom";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Supplier } from "../types/supplier.types";
import {
  formatSupplierDate,
  formatSupplierCurrency,
  getPrimarySupplierAddress,
} from "../utils/supplier.utils";

import { SupplierAvatar } from "./SupplierAvatar";
import { SupplierStatusBadge } from "./SupplierStatusBadge";
import { SupplierTypeBadge } from "./SupplierTypeBadge";

interface SupplierTableProps {
  suppliers: Supplier[];
  onDelete?: (supplier: Supplier) => void;
}

export function SupplierTable({ suppliers, onDelete }: SupplierTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Supplier code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Outstanding balance</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {suppliers.map((supplier) => {
                const address = getPrimarySupplierAddress(supplier);

                return (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <SupplierAvatar name={supplier.name} />
                        <div>
                          <p className="font-medium">{supplier.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {supplier.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{supplier.supplierCode}</TableCell>

                    <TableCell>
                      <SupplierTypeBadge type={supplier.type} />
                    </TableCell>

                    <TableCell>
                      {address ? `${address.city}, ${address.country}` : "—"}
                    </TableCell>

                    <TableCell>
                      <SupplierStatusBadge status={supplier.status} />
                    </TableCell>

                    <TableCell className="font-medium">
                      {formatSupplierCurrency(
                        supplier.paymentSummary.outstandingBalance,
                        supplier.paymentSummary.currency,
                      )}
                    </TableCell>

                    <TableCell>
                      {formatSupplierDate(supplier.createdAt)}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/suppliers/${supplier.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View details
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link to={`/suppliers/${supplier.id}/edit`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit supplier
                            </Link>
                          </DropdownMenuItem>

                          {onDelete && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => onDelete(supplier)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete supplier
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
