import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoodsReceiptForm } from "../components/GoodsReceiptForm";
import { useProcurementMutations } from "../hooks/useProcurementMutations";

export function CreateGoodsReceiptPage() {
  const navigate = useNavigate();
  const { createGoodsReceipt } = useProcurementMutations();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button asChild variant="ghost">
        <Link to="/procurement/goods-receipts">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to goods receipts
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold">Record goods receipt</h1>
        <p className="text-muted-foreground">
          Record quantities delivered by a supplier and inspect the items.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Goods receipt information</CardTitle>
        </CardHeader>
        <CardContent>
          <GoodsReceiptForm
            isSubmitting={createGoodsReceipt.isPending}
            onSubmit={(input) =>
              createGoodsReceipt.mutate(input, {
                onSuccess: () => navigate("/procurement/goods-receipts"),
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
