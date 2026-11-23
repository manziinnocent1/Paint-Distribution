import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { DeliveryForm } from "../components/forms/DeliveryForm";
import { useDelivery } from "../hooks/useDelivery";
import { useDeliveryMutations } from "../hooks/useDeliveryMutations";
import type { DeliveryFormValues } from "../types/delivery.types";

export function EditDeliveryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const deliveryQuery = useDelivery(id);
  const { updateDelivery } = useDeliveryMutations();
  const [error, setError] = useState("");

  const handleSubmit = async (values: DeliveryFormValues) => {
    if (!id) return;
    setError("");

    try {
      await updateDelivery.mutateAsync({ id, values });
      navigate(`/deliveries/${id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update delivery.",
      );
    }
  };

  if (deliveryQuery.isLoading) {
    return <div className="h-96 animate-pulse rounded-xl bg-slate-100" />;
  }

  if (deliveryQuery.isError || !deliveryQuery.data) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <AlertCircle className="mx-auto text-red-500" size={28} />
        <p className="mt-3 font-semibold text-slate-900">Delivery not found</p>
        <Link
          to="/deliveries"
          className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline"
        >
          Back to deliveries
        </Link>
      </div>
    );
  }

  const delivery = deliveryQuery.data;

  return (
    <main className="mx-auto max-w-4xl space-y-6 pb-8">
      <div>
        <Link
          to={`/deliveries/${delivery.id}`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={15} />
          Back to delivery
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Edit {delivery.deliveryNumber}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update the delivery information and destination.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <DeliveryForm
          initialValues={delivery}
          onSubmit={handleSubmit}
          isSubmitting={updateDelivery.isPending}
          submitLabel="Save changes"
        />
      </section>
    </main>
  );
}

export default EditDeliveryPage;
