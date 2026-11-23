import { Bell, Inbox } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
  compact?: boolean;
}

export function NotificationEmptyState({
  title = "You're all caught up",
  description = "There are no notifications to display.",
  compact = false,
}: Props) {
  const Icon = compact ? Bell : Inbox;

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-5 py-12 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>

      <h3 className="font-semibold">{title}</h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
