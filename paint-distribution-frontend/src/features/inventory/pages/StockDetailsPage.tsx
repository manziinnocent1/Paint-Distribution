import { useState } from "react";
import { useParams } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { StockAdjustmentForm, StockDetails } from "../components";

import { useStockItem } from "../hooks/useStockItem";
import { useInventory } from "../hooks/useInventory";
import { useInventoryMutations } from "../hooks/useInventoryMutations";

export function StockDetailsPage() {
  const { id = "" } = useParams();
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);

  const { data: stock, isLoading, error } = useStockItem(id);
  const { data: stockList } = useInventory({ page: 1, pageSize: 100 });
  const { createAdjustment } = useInventoryMutations();

  if (isLoading) {
    return (
      <p className="p-6 text-muted-foreground">Loading stock details...</p>
    );
  }

  if (error || !stock) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <h2 className="font-semibold">Stock record not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested inventory record could not be loaded.
        </p>
      </div>
    );
  }

  const handleAdjustment = async (
    values: Parameters<typeof createAdjustment.mutateAsync>[0],
  ) => {
    await createAdjustment.mutateAsync(values);
    setAdjustmentOpen(false);
  };

  return (
    <>
      <StockDetails stock={stock} onAdjust={() => setAdjustmentOpen(true)} />

      <Dialog open={adjustmentOpen} onOpenChange={setAdjustmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust stock</DialogTitle>
            <DialogDescription>
              Record a stock movement for this inventory item.
            </DialogDescription>
          </DialogHeader>

          <StockAdjustmentForm
            items={stockList?.results ?? [stock]}
            onSubmit={handleAdjustment}
            isSubmitting={createAdjustment.isPending}
            onCancel={() => setAdjustmentOpen(false)}
          />

          {createAdjustment.isError && (
            <p className="text-sm text-destructive">
              {createAdjustment.error.message}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
