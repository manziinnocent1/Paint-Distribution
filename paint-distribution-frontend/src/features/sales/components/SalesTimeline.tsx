import { CheckCircle2, Circle, FilePlus2, Pencil, XCircle } from "lucide-react";
import type { SaleTimelineEvent } from "../types/sales.types";
import { formatSaleDate } from "../utils/sales.utils";

const icons = {
  created: FilePlus2,
  updated: Pencil,
  confirmed: CheckCircle2,
  completed: CheckCircle2,
  cancelled: XCircle,
};

export function SalesTimeline({ events }: { events: SaleTimelineEvent[] }) {
  if (!events.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No activity has been recorded.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {events.map((event) => {
        const Icon = icons[event.type] ?? Circle;

        return (
          <div key={event.id} className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{event.title}</p>
              {event.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {event.description}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                {formatSaleDate(event.date)} · {event.user}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
