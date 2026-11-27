import { MapPin, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import type { CustomerAddress } from "../../types/customer.types";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import { formatCustomerAddress } from "../../utils/customer.utils";

interface CustomerAddressCardProps {
  address: CustomerAddress;
  onEdit: (address: CustomerAddress) => void;
  onDelete: (address: CustomerAddress) => void;
}

export function CustomerAddressCard({
  address,
  onEdit,
  onDelete,
}: CustomerAddressCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <MapPin className="h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="font-medium">{address.address_type}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatCustomerAddress(address)}
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
            <DropdownMenuItem onClick={() => onEdit(address)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(address)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="outline">{address.address_type}</Badge>

        {address.is_default && <Badge>Default address</Badge>}
      </div>
    </div>
  );
}
