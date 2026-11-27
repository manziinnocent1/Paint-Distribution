import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import type { Customer } from "../types/customer.types";

import { Button } from "../components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

import { CustomerAvatar } from "./shared/CustomerAvatar";
import { CustomerStatusBadge } from "./shared/CustomerStatusBadge";
import { CustomerTypeBadge } from "./shared/CustomerTypeBadge";

import { getCustomerFullName } from "../utils/customer.utils";

interface CustomerTableProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerTable({
  customers,
  onView,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <div className="rounded-lg border p-12 text-center">
        <h3 className="font-semibold">No customers found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a customer or adjust your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Customer type</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <CustomerAvatar customer={customer} size="sm" />
                  <div className="min-w-0">
                    <p className="font-medium">
                      {getCustomerFullName(customer)}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {customer.customer_number}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <CustomerTypeBadge type={customer.customer_type} />
              </TableCell>

              <TableCell>{customer.phone_number}</TableCell>

              <TableCell>{customer.email || "—"}</TableCell>

              <TableCell>
                <CustomerStatusBadge status={customer.status} />
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(customer)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => onEdit(customer)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(customer)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
