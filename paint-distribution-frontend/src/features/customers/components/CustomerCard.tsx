import { Eye, MoreHorizontal, Pencil, Trash2, Phone, Mail } from "lucide-react";

import type { Customer } from "../types/customer.types";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CustomerAvatar } from "./shared/CustomerAvatar";
import { CustomerStatusBadge } from "./shared/CustomerStatusBadge";
import { CustomerTypeBadge } from "./shared/CustomerTypeBadge";

import {
  getCustomerFullName,
  formatCustomerDate,
} from "../utils/customer.utils";

interface CustomerCardProps {
  customer: Customer;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerCard({
  customer,
  onView,
  onEdit,
  onDelete,
}: CustomerCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <CustomerAvatar customer={customer} />

          <div className="min-w-0">
            <h3 className="truncate font-semibold">
              {getCustomerFullName(customer)}
            </h3>
            <p className="text-xs text-muted-foreground">
              {customer.customer_number}
            </p>
          </div>
        </div>

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
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <CustomerTypeBadge type={customer.customer_type} />
        <CustomerStatusBadge status={customer.status} />
      </div>

      <div className="mt-5 space-y-3 border-t pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4 shrink-0" />
          <span>{customer.phone_number}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {customer.email || "No email provided"}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
        <span>Registered</span>
        <span>{formatCustomerDate(customer.created_at)}</span>
      </div>
    </div>
  );
}
