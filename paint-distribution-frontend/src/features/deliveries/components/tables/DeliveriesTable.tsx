import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Delivery } from "../../types/delivery.types";
import { DeliveryStatusBadge } from "../cards/DeliveryStatusBadge";
import {
  formatDeliveryCurrency,
  formatDeliveryDate,
} from "../../utils/delivery-formatters";

interface DeliveriesTableProps {
  deliveries: Delivery[];
  onDelete?: (delivery: Delivery) => void;
  isDeleting?: boolean;
}

export function DeliveriesTable({
  deliveries,
  onDelete,
  isDeleting = false,
}: DeliveriesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3 font-medium">Delivery</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Destination</th>
            <th className="px-4 py-3 font-medium">Driver</th>
            <th className="px-4 py-3 font-medium">Fee</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {deliveries.map((delivery) => (
            <tr
              key={delivery.id}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
            >
              <td className="px-4 py-4">
                <Link
                  to={`/deliveries/${delivery.id}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {delivery.deliveryNumber}
                </Link>
                <p className="mt-1 text-xs text-slate-500">
                  {delivery.trackingNumber}
                </p>
              </td>

              <td className="px-4 py-4">
                <p className="font-medium text-slate-800">
                  {delivery.customer.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {delivery.customer.phoneNumber}
                </p>
              </td>

              <td className="px-4 py-4 text-slate-600">
                {delivery.address.city}, {delivery.address.country}
              </td>

              <td className="px-4 py-4 text-slate-600">
                {delivery.driver?.name ?? "Unassigned"}
              </td>

              <td className="px-4 py-4 font-medium text-slate-800">
                {formatDeliveryCurrency(delivery.deliveryFee)}
              </td>

              <td className="px-4 py-4">
                <DeliveryStatusBadge status={delivery.status} />
              </td>

              <td className="px-4 py-4 text-slate-500">
                {formatDeliveryDate(delivery.createdAt)}
              </td>

              <td className="px-4 py-4">
                <div className="flex justify-end gap-1">
                  <Link
                    to={`/deliveries/${delivery.id}`}
                    aria-label={`View ${delivery.deliveryNumber}`}
                    className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Eye size={16} />
                  </Link>

                  <Link
                    to={`/deliveries/${delivery.id}/edit`}
                    aria-label={`Edit ${delivery.deliveryNumber}`}
                    className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                  >
                    <Pencil size={16} />
                  </Link>

                  {onDelete && (
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => onDelete(delivery)}
                      aria-label={`Delete ${delivery.deliveryNumber}`}
                      className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {deliveries.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                No deliveries found. Try changing your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
