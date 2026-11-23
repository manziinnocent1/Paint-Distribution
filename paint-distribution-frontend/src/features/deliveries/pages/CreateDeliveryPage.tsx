import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { DeliveryForm } from "../components/forms/DeliveryForm";
import { useDeliveryMutations } from "../hooks/useDeliveryMutations";
import type { DeliveryFormValues } from "../types/delivery.types";

export function CreateDeliveryPage() {
  const navigate = useNavigate();
  const { createDelivery } = useDeliveryMutations();
  const [error, setError] = useState("");

  const handleSubmit = async (values: DeliveryFormValues) => {
    setError("");

    try {
      const delivery = await createDelivery.mutateAsync(values);
      navigate(`/deliveries/${delivery.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create delivery.",
      );
    }
  };

  return (
    <main className="mx-auto max-w-4xl space-y-6 pb-8">
      <div>
        <Link
          to="/deliveries"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={15} />
          Back to deliveries
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Create delivery
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create a delivery record for an existing customer order.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        {error && (
          <p
            role="alert"
            className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <DeliveryForm
          onSubmit={handleSubmit}
          isSubmitting={createDelivery.isPending}
          submitLabel="Create delivery"
        />
      </section>
    </main>
  );
}

export default CreateDeliveryPage;
