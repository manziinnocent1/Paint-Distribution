export type NotificationCategory =
  | "orders"
  | "payments"
  | "inventory"
  | "deliveries"
  | "customers"
  | "system";

export type NotificationPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";

export type NotificationStatus =
  | "unread"
  | "read"
  | "archived";

export type NotificationChannel =
  | "in_app"
  | "email"
  | "sms"
  | "push";

export type NotificationActionType =
  | "view_order"
  | "view_payment"
  | "view_product"
  | "view_delivery"
  | "view_customer"
  | "view_inventory"
  | "view_settings"
  | "open_notifications";

export interface NotificationAction {
  label: string;
  type: NotificationActionType;
  referenceId?: string;
  url?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  channels: NotificationChannel[];
  action?: NotificationAction;
  referenceNumber?: string;
  createdAt: string;
  readAt?: string;
  archivedAt?: string;
  sender?: string;
}

export interface NotificationFilters {
  search?: string;
  category?: NotificationCategory | "all";
  priority?: NotificationPriority | "all";
  status?: NotificationStatus | "all";
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedNotifications {
  results: AppNotification[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  archived: number;
  urgent: number;
}

export interface NotificationCategoryPreference {
  enabled: boolean;
  inApp: boolean;
  email: boolean;
  sms: boolean;
  push: boolean;
}

export type NotificationCategoryPreferences = Record<
  NotificationCategory,
  NotificationCategoryPreference
>;

export interface NotificationPreferences {
  categories: NotificationCategoryPreferences;
  emailAddress: string;
  phoneNumber: string;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  updatedAt?: string;
}

export interface NotificationPreferenceValues
  extends Omit<NotificationPreferences, "updatedAt"> {}

export interface NotificationBulkActionValues {
  notificationIds: string[];
  action: "mark_read" | "mark_unread" | "archive" | "delete";
}