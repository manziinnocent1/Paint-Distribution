import { Badge } from "@/components/ui/badge";

import type {
  NotificationPriority,
  NotificationStatus,
} from "../types/notification.types";

interface PriorityProps {
  priority: NotificationPriority;
}

interface StatusProps {
  status: NotificationStatus;
}

const priorityStyles: Record<NotificationPriority, string> = {
  low: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  normal: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  high: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  urgent: "bg-red-100 text-red-700 hover:bg-red-100",
};

const statusStyles: Record<NotificationStatus, string> = {
  unread: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  read: "bg-green-100 text-green-700 hover:bg-green-100",
  archived: "bg-gray-100 text-gray-600 hover:bg-gray-100",
};

export function NotificationPriorityBadge({ priority }: PriorityProps) {
  return (
    <Badge className={priorityStyles[priority]}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}

export function NotificationStatusBadge({ status }: StatusProps) {
  return (
    <Badge className={statusStyles[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
