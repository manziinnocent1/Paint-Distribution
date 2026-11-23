import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesForm } from "../components/SalesForm";
import { useSale } from "../hooks/useSale";
import { useSalesMutations } from "../hooks/useSalesMutations";
import { canEditSale } from "../utils/sales.utils";

export function EditSalePage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: sale, isLoading, isError } = useSale(id);
  const { updateSale } = useSalesMutations();

  if (isLoading) {
    return <div className="p-8 text-center">Loading sale...</div>;
  }

  if (isError || !sale) {
    return (
      <div className="rounded-lg border p-8 text-center text-destructive">
        Sale not found.
      </div>
    );
  }

  if (!canEditSale(sale)) {
    return (
      <div className="space-y-3 rounded-lg border p-8 text-center">
        <p>This sale can no longer be edited.</p>
        <Button asChild variant="outline">
          <Link to={`/sales/${sale.id}`}>Return to sale</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Button asChild variant="ghost">
        <Link to={`/sales/${sale.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sale
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold">Edit sale</h1>
        <p className="text-muted-foreground">{sale.saleNumber}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update sale information</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesForm
            initialData={sale}
            isSubmitting={updateSale.isPending}
            onSubmit={(values) =>
              updateSale.mutate(
                { id: sale.id, input: values },
                { onSuccess: () => navigate(`/sales/${sale.id}`) },
              )
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
