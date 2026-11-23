import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchaseOrderForm } from "../components/PurchaseOrderForm";
import { useProcurement } from "../hooks/useProcurement";
import { useProcurementMutations } from "../hooks/useProcurementMutations";

export function CreatePurchaseOrderPage() {
  const navigate = useNavigate();
  const { data } = useProcurement({ status: "approved" }, 1, 100);
  const { createPurchaseOrder } = useProcurementMutations();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button asChild variant="ghost">
        <Link to="/procurement/purchase-orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to purchase orders
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold">Create purchase order</h1>
        <p className="text-muted-foreground">
          Create a supplier order using an approved request or enter items
          manually.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase order information</CardTitle>
        </CardHeader>
        <CardContent>
          <PurchaseOrderForm
            approvedRequests={data?.results ?? []}
            isSubmitting={createPurchaseOrder.isPending}
            onSubmit={(input) =>
              createPurchaseOrder.mutate(input, {
                onSuccess: (order) =>
                  navigate(`/procurement/purchase-orders/${order.id}`),
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
