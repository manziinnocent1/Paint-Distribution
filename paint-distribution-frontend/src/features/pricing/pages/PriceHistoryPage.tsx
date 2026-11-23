import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceHistory } from "../components";
import { usePrice } from "../hooks/usePrice";

export function PriceHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const { data: price, isLoading, isError } = usePrice(id);

  if (isLoading) {
    return (
      <div className="p-10 text-center text-sm text-muted-foreground">
        Loading pricing information...
      </div>
    );
  }

  if (isError || !price) {
    return (
      <div className="rounded-md border p-10 text-center">
        <p className="text-sm text-destructive">
          Unable to find this pricing record.
        </p>
        <Button asChild className="mt-3">
          <Link to="/pricing">Back to pricing</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild className="-ml-3 mb-3">
          <Link to={`/pricing/${price.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to price details
          </Link>
        </Button>

        <h1 className="text-2xl font-bold tracking-tight">Price history</h1>
        <p className="text-sm text-muted-foreground">
          {price.productName} · {price.productSku}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price changes</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceHistory priceId={price.id} />
        </CardContent>
      </Card>
    </div>
  );
}
