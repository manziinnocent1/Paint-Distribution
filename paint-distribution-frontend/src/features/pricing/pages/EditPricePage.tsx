import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingForm } from "../components";
import { usePrice } from "../hooks/usePrice";

export function EditPricePage() {
  const { id } = useParams<{ id: string }>();
  const { data: price, isLoading, isError, refetch } = usePrice(id);

  if (isLoading) {
    return (
      <div className="p-10 text-center text-sm text-muted-foreground">
        Loading price record...
      </div>
    );
  }

  if (isError || !price) {
    return (
      <div className="space-y-4 rounded-md border p-10 text-center">
        <p className="text-sm text-destructive">
          Unable to load this pricing record.
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
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Button variant="ghost" asChild className="-ml-3 mb-3">
          <Link to={`/pricing/${price.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to price details
          </Link>
        </Button>

        <h1 className="text-2xl font-bold tracking-tight">Edit price</h1>
        <p className="text-sm text-muted-foreground">
          Update the price information for {price.productName}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update pricing information</CardTitle>
        </CardHeader>
        <CardContent>
          <PricingForm price={price} />
        </CardContent>
      </Card>
    </div>
  );
}
