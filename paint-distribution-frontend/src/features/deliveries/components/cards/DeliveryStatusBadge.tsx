import { DELIVERY_STATUS_COLORS } from "../../constants/delivery.constants";
import { formatDeliveryStatus } from "../../utils/delivery-formatters";
import type { DeliveryStatus } from "../../types/delivery.types";

interface DeliveryStatusBadgeProps {
  status: DeliveryStatus;
}

export function DeliveryStatusBadge({ status }: DeliveryStatusBadgeProps) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${DELIVERY_STATUS_COLORS[status]}`}
    >
      {formatDeliveryStatus(status)}
    </span>
  );
}
