import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";

import type {
  Customer,
  CustomerFilters as CustomerFilterValues,
  CustomerFormValues,
} from "../types/customer.types";

import { useCustomers } from "../hooks/useCustomer";
import { useCustomerMutations } from "../hooks/useCustomerMutations";

import { CUSTOMER_DEFAULT_FILTERS } from "../constants/customer.constants";

import { CustomerTable } from "../components/CustomerTable";
import { CustomerCard } from "../components/CustomerCard";
import { CustomerForm } from "../components/CustomerForm";
import { CustomerDetails } from "../components/CustomerDetails";
import { CustomerFilters } from "../components/CustomerFilters";
import { CustomerStats } from "../components/CustomerStats";

import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export default function CustomersPage() {
  const [filters, setFilters] = useState<CustomerFilterValues>({
    ...CUSTOMER_DEFAULT_FILTERS,
  });

  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >();

  const [dialogMode, setDialogMode] = useState<
    "create" | "edit" | "view" | null
  >(null);

  const { data, isLoading, isError, error, refetch } = useCustomers(filters);

  const mutations = useCustomerMutations();

  const customers = data?.results ?? [];
  const total = data?.count ?? 0;

  const openDialog = (
    mode: "create" | "edit" | "view",
    customer?: Customer,
  ) => {
    setSelectedCustomer(customer);
    setDialogMode(mode);
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedCustomer(undefined);
  };

  const handleSubmit = async (values: CustomerFormValues) => {
    try {
      if (dialogMode === "edit" && selectedCustomer) {
        await mutations.updateCustomer.mutateAsync({
          id: selectedCustomer.id,
          payload: values,
        });

        toast.success("Customer updated successfully.");
      } else {
        await mutations.createCustomer.mutateAsync(values);
        toast.success("Customer created successfully.");
      }

      closeDialog();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save customer.",
      );
    }
  };

  const handleDelete = async (customer: Customer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${customer.business_name || `${customer.first_name} ${customer.last_name}`}?`,
    );

    if (!confirmed) return;

    try {
      await mutations.deleteCustomer.mutateAsync(customer.id);
      toast.success("Customer deleted successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete customer.",
      );
    }
  };

  const isSubmitting =
    mutations.createCustomer.isPending || mutations.updateCustomer.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              Customer Management
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage individual customers, businesses and their contact
            information.
          </p>
        </div>

        <Button onClick={() => openDialog("create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add customer
        </Button>
      </div>

      <CustomerStats customers={customers} total={total} />

      <Card>
        <CardContent className="space-y-5 p-5">
          <CustomerFilters filters={filters} onChange={setFilters} />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing {customers.length} of {total} customers
            </p>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={viewMode === "table" ? "default" : "outline"}
                onClick={() => setViewMode("table")}
              >
                Table
              </Button>

              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-lg border p-12 text-center text-sm text-muted-foreground">
              Loading customers...
            </div>
          ) : isError ? (
            <div className="rounded-lg border p-10 text-center">
              <p className="text-sm text-destructive">
                {error instanceof Error
                  ? error.message
                  : "Unable to load customers."}
              </p>

              <Button
                variant="outline"
                className="mt-3"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          ) : viewMode === "table" ? (
            <CustomerTable
              customers={customers}
              onView={(customer) => openDialog("view", customer)}
              onEdit={(customer) => openDialog("edit", customer)}
              onDelete={handleDelete}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {customers.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onView={(item) => openDialog("view", item)}
                  onEdit={(item) => openDialog("edit", item)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {total > (filters.page_size ?? 10) && (
            <div className="flex items-center justify-end gap-3 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={(filters.page ?? 1) <= 1}
                onClick={() =>
                  setFilters((previous) => ({
                    ...previous,
                    page: Math.max(1, (previous.page ?? 1) - 1),
                  }))
                }
              >
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {filters.page ?? 1} of{" "}
                {Math.ceil(total / (filters.page_size ?? 10))}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={
                  (filters.page ?? 1) >=
                  Math.ceil(total / (filters.page_size ?? 10))
                }
                onClick={() =>
                  setFilters((previous) => ({
                    ...previous,
                    page: (previous.page ?? 1) + 1,
                  }))
                }
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={dialogMode !== null}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create"
                ? "Register new customer"
                : dialogMode === "edit"
                  ? "Update customer"
                  : "Customer details"}
            </DialogTitle>

            <DialogDescription>
              {dialogMode === "view"
                ? "Review customer information."
                : "Complete the customer information below."}
            </DialogDescription>
          </DialogHeader>

          {dialogMode === "view" && selectedCustomer && (
            <CustomerDetails customer={selectedCustomer} />
          )}

          {(dialogMode === "create" || dialogMode === "edit") && (
            <CustomerForm
              initialData={selectedCustomer}
              onSubmit={handleSubmit}
              onCancel={closeDialog}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
