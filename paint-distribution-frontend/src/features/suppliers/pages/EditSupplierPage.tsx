import { useNavigate, useParams } from "react-router-dom";

import { SupplierForm } from "../components";
import { useSupplier } from "../hooks/useSupplier";
import { useSupplierMutations } from "../hooks/useSupplierMutations";

import type { SupplierFormValues } from "../schemas/supplier.schema";

export function EditSupplierPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: supplier, isLoading, isError } = useSupplier(id);
  const { updateSupplier } = useSupplierMutations();

  const handleSubmit = (values: SupplierFormValues) => {
    if (!id) return;

    updateSupplier.mutate(
      { id, input: values },
      {
        onSuccess: () => navigate(`/suppliers/${id}`),
      },
    );
  };

  if (isLoading) {
    return <p className="py-16 text-center">Loading supplier...</p>;
  }

  if (isError || !supplier) {
    return (
      <div className="py-16 text-center">
        <h2 className="font-semibold">Supplier not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The supplier may have been deleted or the address may be incorrect.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit supplier</h1>
        <p className="text-sm text-muted-foreground">
          Update the information for {supplier.name}.
        </p>
      </div>

      <SupplierForm
        initialData={supplier}
        onSubmit={handleSubmit}
        isSubmitting={updateSupplier.isPending}
        submitLabel="Save changes"
      />
    </div>
  );
}
