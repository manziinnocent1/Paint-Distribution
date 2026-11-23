import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PricingDetails } from "../components";
import { usePrice } from "../hooks/usePrice";

export function PriceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: price, isLoading, isError, refetch } = usePrice(id);

  if (isLoading) {
    return (
      <div className="p-10 text-center text-sm text-muted-foreground">
        Loading price details...
      </div>
    );
  }

  if (isError || !price) {
    return (
      <div className="space-y-4 rounded-md border p-10 text-center">
        <p className="text-sm text-destructive">
          Unable to find this pricing record.
        </p>
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Button asChild>
            <Link to="/pricing">Back to pricing</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Price details</h1>
        <p className="text-sm text-muted-foreground">
          Review and manage this product's pricing information.
        </p>
      </div>

      <PricingDetails price={price} />
    </div>
  );
}
