import { Link } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import type { Delivery } from "../../types/delivery.types";
import { DeliveryStatusBadge } from "../cards/DeliveryStatusBadge";
import { DeliveryInformation } from "./DeliveryInformation";
import { DeliveryAddress } from "./DeliveryAddress";
import { DeliveryStatusHistory } from "./DeliveryStatusHistory";
import { DeliveryProof } from "./DeliveryProof";
import { DeliveryStatusForm } from "../forms/DeliveryStatusForm";
import type { DeliveryStatusFormValues } from "../../types/delivery.types";

interface DeliveryDetailsProps {
  delivery: Delivery;
  isUpdatingStatus?: boolean;
  onUpdateStatus: (values: DeliveryStatusFormValues) => void | Promise<void>;
}

export function DeliveryDetails({
  delivery,
  isUpdatingStatus = false,
  onUpdateStatus,
}: DeliveryDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/deliveries"
            className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={15} />
            Back to deliveries
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {delivery.deliveryNumber}
            </h1>
            <DeliveryStatusBadge status={delivery.status} />
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Tracking number: {delivery.trackingNumber}
          </p>
        </div>

        <Link
          to={`/deliveries/${delivery.id}/edit`}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Pencil size={16} />
          Edit delivery
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-slate-900">
              Delivery information
            </h2>
            <DeliveryInformation delivery={delivery} />
            {delivery.deliveryNotes && (
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs font-medium text-slate-500">
                  Delivery notes
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {delivery.deliveryNotes}
                </p>
              </div>
            )}
            {delivery.failureReason && (
              <div className="mt-4 rounded-lg bg-red-50 p-4">
                <p className="text-xs font-semibold text-red-700">
                  Failure reason
                </p>
                <p className="mt-1 text-sm text-red-700">
                  {delivery.failureReason}
                </p>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-slate-900">
              Customer and destination
            </h2>
            <DeliveryAddress delivery={delivery} />
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-slate-900">
              Proof of delivery
            </h2>
            <DeliveryProof
              imageUrl={delivery.proofOfDelivery}
              recipientName={delivery.recipientName}
              recipientPhone={delivery.recipientPhone}
            />
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-slate-900">Update status</h2>
            <DeliveryStatusForm
              currentStatus={delivery.status}
              onSubmit={onUpdateStatus}
              isSubmitting={isUpdatingStatus}
            />
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-5 font-semibold text-slate-900">
              Status history
            </h2>
            <DeliveryStatusHistory history={delivery.statusHistory ?? []} />
          </section>
        </div>
      </div>
    </div>
  );
}
