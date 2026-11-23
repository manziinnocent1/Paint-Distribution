import { CheckCircle2, Circle, Clock3, XCircle } from "lucide-react";
import type { PaymentTimelineEvent } from "../types/payment.types";
import { formatPaymentDate } from "../utils/payment.utils";

interface Props {
  events: PaymentTimelineEvent[];
}

export function PaymentTimeline({ events }: Props) {
  if (!events.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No payment activity has been recorded.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {events.map((event, index) => {
        const Icon =
          event.status === "completed"
            ? CheckCircle2
            : event.status === "failed" || event.status === "cancelled"
              ? XCircle
              : event.status === "processing"
                ? Clock3
                : Circle;

        return (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <Icon className="h-5 w-5 text-muted-foreground" />
              {index !== events.length - 1 && (
                <div className="mt-2 min-h-6 w-px flex-1 bg-border" />
              )}
            </div>

            <div className="pb-2">
              <p className="font-medium">{event.title}</p>
              {event.description && (
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                {formatPaymentDate(event.date)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
