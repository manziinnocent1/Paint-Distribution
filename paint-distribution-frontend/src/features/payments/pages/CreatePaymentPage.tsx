import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentForm } from "../components";

export function CreatePaymentPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Button variant="ghost" asChild className="-ml-3 mb-3">
          <Link to="/payments">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to payments
          </Link>
        </Button>

        <h1 className="text-2xl font-bold tracking-tight">Record payment</h1>
        <p className="text-sm text-muted-foreground">
          Create a payment record for a customer transaction.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment information</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentForm />
        </CardContent>
      </Card>
    </div>
  );
}
