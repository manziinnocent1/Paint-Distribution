import { useNavigate } from "react-router-dom";

import { SupplierForm } from "../components";
import { useSupplierMutations } from "../hooks/useSupplierMutations";
import type { SupplierFormValues } from "../schemas/supplier.schema";

export function CreateSupplierPage() {
  const navigate = useNavigate();
  const { createSupplier } = useSupplierMutations();

  const handleSubmit = (values: SupplierFormValues) => {
    createSupplier.mutate(values, {
      onSuccess: (supplier) => {
        navigate(`/suppliers/${supplier.id}`);
      },
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add supplier</h1>
        <p className="text-sm text-muted-foreground">
          Register a new supplier and provide their business information.
        </p>
      </div>

      <SupplierForm
        onSubmit={handleSubmit}
        isSubmitting={createSupplier.isPending}
        submitLabel="Create supplier"
      />
    </div>
  );
}
