import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Sale } from "../types/sales.types";
import { formatSaleCurrency, formatSaleDate } from "../utils/sales.utils";
import { SalesPaymentBadge, SalesStatusBadge } from "./SalesStatusBadge";

export function SalesTable({ sales }: { sales: Sale[] }) {
  if (!sales.length) {
    return (
      <div className="rounded-lg border p-10 text-center text-muted-foreground">
        No sales match your search.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sale number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Sale status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">{sale.saleNumber}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{sale.customer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {sale.customer.phone || sale.customer.email || "—"}
                  </p>
                </div>
              </TableCell>
              <TableCell>{formatSaleDate(sale.saleDate)}</TableCell>
              <TableCell>
                <SalesStatusBadge status={sale.status} />
              </TableCell>
              <TableCell>
                <SalesPaymentBadge status={sale.paymentStatus} />
              </TableCell>
              <TableCell className="font-medium">
                {formatSaleCurrency(sale.total, sale.currency)}
              </TableCell>
              <TableCell>
                {formatSaleCurrency(sale.balanceDue, sale.currency)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="icon">
                    <Link to={`/sales/${sale.id}`} aria-label="View sale">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  {["draft", "pending"].includes(sale.status) && (
                    <Button asChild variant="ghost" size="icon">
                      <Link
                        to={`/sales/${sale.id}/edit`}
                        aria-label="Edit sale"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
