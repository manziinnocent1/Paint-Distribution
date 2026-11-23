import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesDetails } from "../components/SalesDetails";
import { SalesActions } from "../components/SalesActions";
import { SalesTimeline } from "../components/SalesTimeline";
import { useSale, useSaleTimeline } from "../hooks/useSale";
import { useSalesMutations } from "../hooks/useSalesMutations";

export function SaleDetailsPage() {
  const { id = "" } = useParams();
  const { data: sale, isLoading, isError, refetch } = useSale(id);
  const { data: timeline = [] } = useSaleTimeline(id);
  const { updateSaleStatus, deleteSale } = useSalesMutations();

  if (isLoading) {
    return <div className="p-8 text-center">Loading sale...</div>;
  }

  if (isError || !sale) {
    return (
      <div className="space-y-3 rounded-lg border p-8 text-center">
        <p className="text-destructive">Sale not found.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this sale?")) {
      updateSaleStatus.mutate({ id: sale.id, status: "cancelled" });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Permanently delete this sale?")) {
      deleteSale.mutate(sale.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost">
          <Link to="/sales">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sales
          </Link>
        </Button>

        <SalesActions
          sale={sale}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      </div>

      <SalesDetails sale={sale} />

      <Card>
        <CardHeader>
          <CardTitle>Sales activity</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesTimeline events={timeline} />
        </CardContent>
      </Card>
    </div>
  );
}
