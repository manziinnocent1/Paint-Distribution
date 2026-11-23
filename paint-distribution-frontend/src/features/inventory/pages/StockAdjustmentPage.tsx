import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { StockAdjustmentForm } from "../components";
import { useInventory } from "../hooks/useInventory";
import { useInventoryMutations } from "../hooks/useInventoryMutations";

export function StockAdjustmentPage() {
  const navigate = useNavigate();

  const { data, isLoading } = useInventory({
    page: 1,
    pageSize: 100,
  });

  const { createAdjustment } = useInventoryMutations();

  const handleSubmit = async (
    values: Parameters<typeof createAdjustment.mutateAsync>[0],
  ) => {
    await createAdjustment.mutateAsync(values);
    navigate("/inventory/movements");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/inventory">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold">Stock adjustment</h1>
          <p className="text-sm text-muted-foreground">
            Record an inventory movement or correct a physical stock count.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adjustment information</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading stock items...
            </p>
          ) : (
            <StockAdjustmentForm
              items={data?.results ?? []}
              onSubmit={handleSubmit}
              isSubmitting={createAdjustment.isPending}
              onCancel={() => navigate("/inventory")}
            />
          )}

          {createAdjustment.isError && (
            <p className="mt-4 text-sm text-destructive">
              {createAdjustment.error.message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
