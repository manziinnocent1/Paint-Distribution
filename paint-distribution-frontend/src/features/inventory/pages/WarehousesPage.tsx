import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { WarehouseCard, WarehouseForm, WarehouseTable } from "../components";

import { useWarehouses } from "../hooks/useWarehouses";
import { useInventoryMutations } from "../hooks/useInventoryMutations";

import type { Warehouse, WarehouseValues } from "../types/inventory.types";

export function WarehousesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null,
  );

  const { data: warehouses = [], isLoading, error } = useWarehouses();
  const { createWarehouse, updateWarehouse } = useInventoryMutations();

  const isSubmitting = createWarehouse.isPending || updateWarehouse.isPending;

  const openCreate = () => {
    setSelectedWarehouse(null);
    setDialogOpen(true);
  };

  const openEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setDialogOpen(true);
  };

  const handleSubmit = async (values: WarehouseValues) => {
    if (selectedWarehouse) {
      await updateWarehouse.mutateAsync({
        id: selectedWarehouse.id,
        values,
      });
    } else {
      await createWarehouse.mutateAsync(values);
    }

    setDialogOpen(false);
    setSelectedWarehouse(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/inventory">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-bold">Warehouses</h1>
            <p className="text-sm text-muted-foreground">
              Manage inventory storage locations.
            </p>
          </div>
        </div>

        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add warehouse
        </Button>
      </div>

      {error ? (
        <p className="rounded-lg border p-6 text-sm text-destructive">
          Unable to load warehouses.
        </p>
      ) : isLoading ? (
        <p className="rounded-lg border p-8 text-center text-muted-foreground">
          Loading warehouses...
        </p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {warehouses.map((warehouse) => (
              <WarehouseCard
                key={warehouse.id}
                warehouse={warehouse}
                onEdit={openEdit}
              />
            ))}
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">All warehouse records</h2>

            <WarehouseTable warehouses={warehouses} onEdit={openEdit} />
          </div>
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedWarehouse ? "Edit warehouse" : "Create warehouse"}
            </DialogTitle>

            <DialogDescription>
              Enter the warehouse details below.
            </DialogDescription>
          </DialogHeader>

          <WarehouseForm
            warehouse={selectedWarehouse}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => setDialogOpen(false)}
          />

          {(createWarehouse.isError || updateWarehouse.isError) && (
            <p className="text-sm text-destructive">
              {createWarehouse.error?.message ||
                updateWarehouse.error?.message ||
                "Unable to save warehouse."}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
