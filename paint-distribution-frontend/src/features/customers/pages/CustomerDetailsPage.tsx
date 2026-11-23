import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { toast } from "sonner";

import { useCustomer } from "../hooks/useCustomer";
import { useCustomerMutations } from "../hooks/useCustomerMutations";

import { CustomerDetails } from "../components/CustomerDetails";
import { CustomerForm } from "../components/CustomerForm";

import type { CustomerFormValues } from "../types/customer.types";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useState } from "react";

export default function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);

  const { data: customer, isLoading, isError, error } = useCustomer(id);

  const mutations = useCustomerMutations();

  const handleUpdate = async (values: CustomerFormValues) => {
    if (!id) return;

    try {
      await mutations.updateCustomer.mutateAsync({
        id,
        payload: values,
      });

      toast.success("Customer updated successfully.");
      setEditOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update customer.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Loading customer profile...
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="space-y-4 rounded-lg border p-10 text-center">
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Customer not found."}
        </p>

        <Button variant="outline" onClick={() => navigate("/customers")}>
          Back to customers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <Button
          variant="ghost"
          className="w-fit"
          onClick={() => navigate("/customers")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to customers
        </Button>

        <Button onClick={() => setEditOpen(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit customer
        </Button>
      </div>

      <CustomerDetails customer={customer} />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update customer</DialogTitle>
            <DialogDescription>
              Update this customer's profile information.
            </DialogDescription>
          </DialogHeader>

          <CustomerForm
            initialData={customer}
            onSubmit={handleUpdate}
            onCancel={() => setEditOpen(false)}
            isSubmitting={mutations.updateCustomer.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
