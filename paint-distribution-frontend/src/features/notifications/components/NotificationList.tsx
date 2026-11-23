import type { AppNotification } from "../types/notification.types";

import { NotificationItem } from "./NotificationItem";
import { NotificationEmptyState } from "./NotificationEmptyState";

interface Props {
  notifications: AppNotification[];
  selectedIds?: string[];
  showSelection?: boolean;
  compact?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
  onMarkRead?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function NotificationList({
  notifications,
  selectedIds = [],
  showSelection = false,
  compact = false,
  onSelect,
  onMarkRead,
  onArchive,
  onDelete,
  emptyTitle,
  emptyDescription,
}: Props) {
  if (!notifications.length) {
    return (
      <NotificationEmptyState
        title={emptyTitle}
        description={emptyDescription}
        compact={compact}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          selected={selectedIds.includes(notification.id)}
          showSelection={showSelection}
          compact={compact}
          onSelect={onSelect}
          onMarkRead={onMarkRead}
          onArchive={onArchive}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
