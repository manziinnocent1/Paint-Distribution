import { useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { useCustomer } from "../hooks/useCustomer";
import { useCustomerAddresses } from "../hooks/useCustomerAddresses";
import { useCustomerMutations } from "../hooks/useCustomerMutations";

import { CustomerAddressList } from "../components/addresses/CustomerAddressList";
import { CustomerAddressForm } from "../components/addresses/CustomerAddressForm";

import type {
  Customer,
  CustomerAddress,
  CustomerAddressFormValues,
} from "../types/customer.types";

import { Button } from "../components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

function getCustomerDisplayName(customer?: Customer): string {
  if (!customer) return "";

  if (customer.business_name) return customer.business_name;

  return `${customer.first_name} ${customer.last_name}`.trim();
}

interface CustomerAddressesContentProps {
  customerId: string;
}

function CustomerAddressesContent({
  customerId,
}: CustomerAddressesContentProps) {
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<
    CustomerAddress | undefined
  >();

  const { data: customer } = useCustomer(customerId);
  const { data: addresses = [], isLoading } = useCustomerAddresses(customerId);

  const mutations = useCustomerMutations();

  const closeDialog = (): void => {
    setDialogOpen(false);
    setSelectedAddress(undefined);
  };

  const handleSubmit = async (
    values: CustomerAddressFormValues,
  ): Promise<void> => {
    try {
      if (selectedAddress) {
        await mutations.updateAddress.mutateAsync({
          id: selectedAddress.id,
          payload: values,
        });
        toast.success("Address updated successfully.");
      } else {
        await mutations.createAddress.mutateAsync({
          ...values,
          customer: customerId,
        });
        toast.success("Address added successfully.");
      }

      closeDialog();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save address.",
      );
    }
  };

  const handleDelete = async (address: CustomerAddress): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      await mutations.deleteAddress.mutateAsync(address.id);
      toast.success("Address deleted successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete address.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(`/customers/${customerId}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to customer
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Customer addresses
        </h1>
        <p className="text-sm text-muted-foreground">
          {getCustomerDisplayName(customer)}
        </p>
      </div>

      <CustomerAddressList
        addresses={addresses}
        isLoading={isLoading}
        onAdd={() => {
          setSelectedAddress(undefined);
          setDialogOpen(true);
        }}
        onEdit={(address) => {
          setSelectedAddress(address);
          setDialogOpen(true);
        }}
        onDelete={handleDelete}
      />

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {selectedAddress ? "Edit address" : "Add customer address"}
            </DialogTitle>
            <DialogDescription>
              Enter the customer's address information.
            </DialogDescription>
          </DialogHeader>

          <CustomerAddressForm
            initialData={selectedAddress}
            onSubmit={handleSubmit}
            onCancel={closeDialog}
            isSubmitting={
              mutations.createAddress.isPending ||
              mutations.updateAddress.isPending
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CustomerAddressesPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to="/customers" replace />;
  }

  return <CustomerAddressesContent customerId={id} />;
}
