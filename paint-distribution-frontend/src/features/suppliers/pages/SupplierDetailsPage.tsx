import { useParams } from "react-router-dom";

import { SupplierDetails } from "../components";
import { useSupplier } from "../hooks/useSupplier";

export function SupplierDetailsPage() {
  const { id } = useParams();
  const { data: supplier, isLoading, isError, refetch } = useSupplier(id);

  if (isLoading) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        Loading supplier details...
      </div>
    );
  }

  if (isError || !supplier) {
    return (
      <div className="space-y-3 py-16 text-center">
        <h2 className="text-xl font-semibold">Supplier not found</h2>
        <p className="text-sm text-muted-foreground">
          We could not find the supplier you requested.
        </p>
        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() => refetch()}
        >
          Try again
        </button>
      </div>
    );
  }

  return <SupplierDetails supplier={supplier} />;
}
