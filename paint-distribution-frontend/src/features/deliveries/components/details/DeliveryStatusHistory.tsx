import { CheckCircle2, Circle } from "lucide-react";
import type { DeliveryStatusHistory as HistoryItem } from "../../types/delivery.types";
import {
  formatDeliveryDateTime,
  formatDeliveryStatus,
} from "../../utils/delivery-formatters";

interface DeliveryStatusHistoryProps {
  history: HistoryItem[];
}

export function DeliveryStatusHistory({ history }: DeliveryStatusHistoryProps) {
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-5">
      {sortedHistory.map((item, index) => (
        <div key={item.id} className="relative flex gap-3">
          <div className="relative z-10 rounded-full bg-blue-50 p-1.5 text-blue-600">
            {index === 0 ? <CheckCircle2 size={17} /> : <Circle size={17} />}
          </div>

          <div className="min-w-0 flex-1 pb-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-800">
                {formatDeliveryStatus(item.newStatus)}
              </p>
              <span className="text-xs text-slate-400">
                {formatDeliveryDateTime(item.createdAt)}
              </span>
            </div>

            {item.note && (
              <p className="mt-1 text-sm text-slate-500">{item.note}</p>
            )}

            {item.updatedBy && (
              <p className="mt-1 text-xs text-slate-400">
                Updated by {item.updatedBy}
              </p>
            )}
          </div>
        </div>
      ))}

      {history.length === 0 && (
        <p className="py-5 text-sm text-slate-500">
          No delivery status history is available.
        </p>
      )}
    </div>
  );
}
