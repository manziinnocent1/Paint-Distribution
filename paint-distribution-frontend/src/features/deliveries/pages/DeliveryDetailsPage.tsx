import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { DeliveryDetails } from "../components/details/DeliveryDetails";
import { useDelivery } from "../hooks/useDelivery";
import { useDeliveryMutations } from "../hooks/useDeliveryMutations";
import type { DeliveryStatusFormValues } from "../types/delivery.types";

export function DeliveryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const deliveryQuery = useDelivery(id);
  const { updateDeliveryStatus } = useDeliveryMutations();

  const handleUpdateStatus = async (values: DeliveryStatusFormValues) => {
    if (!id) return;
    await updateDeliveryStatus.mutateAsync({ id, values });
  };

  if (deliveryQuery.isLoading) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-96 animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (deliveryQuery.isError || !deliveryQuery.data) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <AlertCircle className="mx-auto text-red-500" size={30} />
        <h1 className="mt-3 font-semibold text-slate-900">
          Delivery not found
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          The delivery may have been removed or the reference may be incorrect.
        </p>
        <Link
          to="/deliveries"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft size={15} />
          Back to deliveries
        </Link>
      </div>
    );
  }

  return (
    <DeliveryDetails
      delivery={deliveryQuery.data}
      isUpdatingStatus={updateDeliveryStatus.isPending}
      onUpdateStatus={handleUpdateStatus}
    />
  );
}

export default DeliveryDetailsPage;
