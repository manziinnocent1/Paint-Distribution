import type {
  NotificationCategory,
  NotificationPriority,
  NotificationStatus,
} from "../types/notification.types";

export function getCategoryLabel(
  category: NotificationCategory,
): string {
  const labels: Record<NotificationCategory, string> = {
    orders: "Orders",
    payments: "Payments",
    inventory: "Inventory",
    deliveries: "Deliveries",
    customers: "Customers",
    system: "System",
  };

  return labels[category];
}

export function getPriorityLabel(
  priority: NotificationPriority,
): string {
  const labels: Record<NotificationPriority, string> = {
    low: "Low",
    normal: "Normal",
    high: "High",
    urgent: "Urgent",
  };

  return labels[priority];
}

export function getStatusLabel(
  status: NotificationStatus,
): string {
  const labels: Record<NotificationStatus, string> = {
    unread: "Unread",
    read: "Read",
    archived: "Archived",
  };

  return labels[status];
}

export function formatNotificationDate(value: string): string {
  return new Intl.DateTimeFormat("en-RW", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function getRelativeNotificationTime(value: string): string {
  const timestamp = new Date(value).getTime();
  const difference = Date.now() - timestamp;

  if (!Number.isFinite(timestamp)) return "Unknown date";

  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  if (days < 7) return `${days}d ago`;

  return formatNotificationDate(value);
}

export function getCategoryIconName(
  category: NotificationCategory,
): string {
  const icons: Record<NotificationCategory, string> = {
    orders: "shopping-cart",
    payments: "credit-card",
    inventory: "package",
    deliveries: "truck",
    customers: "users",
    system: "settings",
  };

  return icons[category];
}

export function getNotificationDestination(
  action?: {
    url?: string;
    referenceId?: string;
    type: string;
  },
): string | null {
  if (!action) return null;

  if (action.url) return action.url;

  if (!action.referenceId) {
    return action.type === "open_notifications"
      ? "/notifications"
      : null;
  }

  const destinations: Record<string, string> = {
    view_order: `/orders/${action.referenceId}`,
    view_payment: `/payments/${action.referenceId}`,
    view_product: `/catalog/products/${action.referenceId}`,
    view_delivery: `/deliveries/${action.referenceId}`,
    view_customer: `/customers/${action.referenceId}`,
    view_inventory: `/inventory/${action.referenceId}`,
    view_settings: "/settings",
  };

  return destinations[action.type] ?? null;
}

export function getUnreadCount(
  notifications: { status: NotificationStatus }[],
): number {
  return notifications.filter(
    (notification) => notification.status === "unread",
  ).length;
}