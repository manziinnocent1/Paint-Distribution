import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingForm } from "../components";

export function CreatePricePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Button variant="ghost" asChild className="-ml-3 mb-3">
          <Link to="/pricing">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to pricing
          </Link>
        </Button>

        <h1 className="text-2xl font-bold tracking-tight">
          Create product price
        </h1>
        <p className="text-sm text-muted-foreground">
          Set the selling price and effective period for a product.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pricing information</CardTitle>
        </CardHeader>
        <CardContent>
          <PricingForm />
        </CardContent>
      </Card>
    </div>
  );
}
