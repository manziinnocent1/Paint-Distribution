import { Plus, MapPin } from "lucide-react";

import type { CustomerAddress } from "../../types/customer.types";

import { Button } from "@/components/ui/button";
import { CustomerAddressCard } from "./CustomerAddressCard";

interface CustomerAddressListProps {
  addresses: CustomerAddress[];
  isLoading?: boolean;
  onAdd: () => void;
  onEdit: (address: CustomerAddress) => void;
  onDelete: (address: CustomerAddress) => void;
}

export function CustomerAddressList({
  addresses,
  isLoading = false,
  onAdd,
  onEdit,
  onDelete,
}: CustomerAddressListProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border p-10 text-center text-sm text-muted-foreground">
        Loading customer addresses...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Customer addresses</h3>
          <p className="text-sm text-muted-foreground">
            Manage billing and shipping addresses.
          </p>
        </div>

        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
          <h4 className="mt-3 font-medium">No addresses added</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Add the customer's billing or shipping address.
          </p>
          <Button className="mt-4" variant="outline" onClick={onAdd}>
            Add first address
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <CustomerAddressCard
              key={address.id}
              address={address}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
