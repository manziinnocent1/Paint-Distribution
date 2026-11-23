import { CalendarClock, Package, Truck, Wallet } from "lucide-react";
import type { Delivery } from "../../types/delivery.types";
import {
  formatDeliveryCurrency,
  formatDeliveryDateTime,
  formatDeliveryVehicle,
} from "../../utils/delivery-formatters";

interface DeliveryInformationProps {
  delivery: Delivery;
}

export function DeliveryInformation({ delivery }: DeliveryInformationProps) {
  const items = [
    {
      label: "Order reference",
      value: delivery.orderReference,
      icon: Package,
    },
    {
      label: "Delivery fee",
      value: formatDeliveryCurrency(delivery.deliveryFee),
      icon: Wallet,
    },
    {
      label: "Vehicle",
      value: formatDeliveryVehicle(
        delivery.driver?.vehicleType ?? delivery.vehicleType,
      ),
      icon: Truck,
    },
    {
      label: "Estimated delivery",
      value: formatDeliveryDateTime(delivery.estimatedDeliveryAt),
      icon: CalendarClock,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-lg border border-slate-100 p-4"
          >
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Icon size={15} />
              {item.label}
            </div>
            <p className="mt-2 font-semibold text-slate-800">{item.value}</p>
          </div>
        );
      })}

      {delivery.dispatchedAt && (
        <div className="rounded-lg border border-slate-100 p-4">
          <p className="text-xs text-slate-500">Dispatched at</p>
          <p className="mt-2 font-semibold text-slate-800">
            {formatDeliveryDateTime(delivery.dispatchedAt)}
          </p>
        </div>
      )}

      {delivery.deliveredAt && (
        <div className="rounded-lg border border-slate-100 p-4">
          <p className="text-xs text-slate-500">Delivered at</p>
          <p className="mt-2 font-semibold text-slate-800">
            {formatDeliveryDateTime(delivery.deliveredAt)}
          </p>
        </div>
      )}

      {delivery.vehicleRegistration && (
        <div className="rounded-lg border border-slate-100 p-4">
          <p className="text-xs text-slate-500">Vehicle registration</p>
          <p className="mt-2 font-semibold text-slate-800">
            {delivery.vehicleRegistration}
          </p>
        </div>
      )}
    </div>
  );
}
