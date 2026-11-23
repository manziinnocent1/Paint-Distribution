import { MapPin, Phone, UserRound } from "lucide-react";
import type { Delivery } from "../../types/delivery.types";

interface DeliveryAddressProps {
  delivery: Delivery;
}

export function DeliveryAddress({ delivery }: DeliveryAddressProps) {
  const { address, customer } = delivery;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
          <UserRound size={18} />
        </span>
        <div>
          <p className="text-xs text-slate-500">Customer</p>
          <p className="mt-1 font-semibold text-slate-800">{customer.name}</p>
          <p className="mt-1 text-sm text-slate-500">
            {customer.email ?? "No email provided"}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
          <Phone size={18} />
        </span>
        <div>
          <p className="text-xs text-slate-500">Contact number</p>
          <p className="mt-1 font-medium text-slate-800">
            {customer.phoneNumber || "Not provided"}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
          <MapPin size={18} />
        </span>
        <div>
          <p className="text-xs text-slate-500">Delivery destination</p>
          <p className="mt-1 font-medium text-slate-800">
            {address.addressLine1}
          </p>
          {address.addressLine2 && (
            <p className="text-sm text-slate-600">{address.addressLine2}</p>
          )}
          <p className="mt-1 text-sm text-slate-600">
            {[address.city, address.district, address.province, address.country]
              .filter(Boolean)
              .join(", ")}
          </p>
          {address.landmark && (
            <p className="mt-1 text-xs text-slate-500">
              Landmark: {address.landmark}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
