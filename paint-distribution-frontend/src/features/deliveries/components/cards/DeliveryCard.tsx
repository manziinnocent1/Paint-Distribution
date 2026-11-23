import { Link } from "react-router-dom";
import { MapPin, Package, UserRound } from "lucide-react";
import type { Delivery } from "../../types/delivery.types";
import { DeliveryStatusBadge } from "./DeliveryStatusBadge";
import {
  formatDeliveryCurrency,
  formatDeliveryDate,
} from "../../utils/delivery-formatters";

interface DeliveryCardProps {
  delivery: Delivery;
}

export function DeliveryCard({ delivery }: DeliveryCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            to={`/deliveries/${delivery.id}`}
            className="font-semibold text-blue-600 hover:underline"
          >
            {delivery.deliveryNumber}
          </Link>
          <p className="mt-1 text-xs text-slate-500">
            Tracking: {delivery.trackingNumber}
          </p>
        </div>
        <DeliveryStatusBadge status={delivery.status} />
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <UserRound size={16} className="shrink-0 text-slate-400" />
          {delivery.customer.name}
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin size={16} className="shrink-0 text-slate-400" />
          {delivery.address.city}, {delivery.address.country}
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Package size={16} className="shrink-0 text-slate-400" />
          Order {delivery.orderReference}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div>
          <p className="text-xs text-slate-500">Delivery fee</p>
          <p className="mt-1 font-semibold text-slate-800">
            {formatDeliveryCurrency(delivery.deliveryFee)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Created</p>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {formatDeliveryDate(delivery.createdAt)}
          </p>
        </div>
      </div>
    </article>
  );
}
