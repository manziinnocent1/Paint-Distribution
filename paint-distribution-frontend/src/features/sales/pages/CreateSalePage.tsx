import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesForm } from "../components/SalesForm";
import { useSalesMutations } from "../hooks/useSalesMutations";

export function CreateSalePage() {
  const navigate = useNavigate();
  const { createSale } = useSalesMutations();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Button asChild variant="ghost">
        <Link to="/sales">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sales
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold">Create sale</h1>
        <p className="text-muted-foreground">
          Select a customer, add products, and record the sale.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sale information</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesForm
            isSubmitting={createSale.isPending}
            onSubmit={(values) =>
              createSale.mutate(values, {
                onSuccess: (sale) => navigate(`/sales/${sale.id}`),
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
