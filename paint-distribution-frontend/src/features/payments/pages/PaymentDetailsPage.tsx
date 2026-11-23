import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentDetails } from "../components";
import { usePayment } from "../hooks/usePayment";

export function PaymentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: payment, isLoading, isError, refetch } = usePayment(id);

  if (isLoading) {
    return (
      <div className="p-10 text-center text-sm text-muted-foreground">
        Loading payment details...
      </div>
    );
  }

  if (isError || !payment) {
    return (
      <div className="space-y-4 rounded-md border p-10 text-center">
        <p className="text-sm text-destructive">Unable to find this payment.</p>
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Button asChild>
            <Link to="/payments">Back to payments</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild className="-ml-3 mb-3">
          <Link to="/payments">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to payments
          </Link>
        </Button>

        <h1 className="text-2xl font-bold tracking-tight">Payment details</h1>
        <p className="text-sm text-muted-foreground">
          Review transaction information and payment activity.
        </p>
      </div>

      <PaymentDetails payment={payment} />
    </div>
  );
}
