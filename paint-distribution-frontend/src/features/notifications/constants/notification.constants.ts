import type {
  NotificationCategory,
  NotificationChannel,
  NotificationPriority,
  NotificationStatus,
} from "../types/notification.types";

export const NOTIFICATION_CATEGORY_OPTIONS: {
  label: string;
  value: NotificationCategory | "all";
}[] = [
  { label: "All categories", value: "all" },
  { label: "Orders", value: "orders" },
  { label: "Payments", value: "payments" },
  { label: "Inventory", value: "inventory" },
  { label: "Deliveries", value: "deliveries" },
  { label: "Customers", value: "customers" },
  { label: "System", value: "system" },
];

export const NOTIFICATION_PRIORITY_OPTIONS: {
  label: string;
  value: NotificationPriority | "all";
}[] = [
  { label: "All priorities", value: "all" },
  { label: "Low", value: "low" },
  { label: "Normal", value: "normal" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
];

export const NOTIFICATION_STATUS_OPTIONS: {
  label: string;
  value: NotificationStatus | "all";
}[] = [
  { label: "All statuses", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
  { label: "Archived", value: "archived" },
];

export const NOTIFICATION_CHANNEL_OPTIONS: {
  label: string;
  value: NotificationChannel;
  description: string;
}[] = [
  {
    label: "In-app",
    value: "in_app",
    description: "Receive notifications inside the application.",
  },
  {
    label: "Email",
    value: "email",
    description: "Receive notifications through your email address.",
  },
  {
    label: "SMS",
    value: "sms",
    description: "Receive important updates through SMS.",
  },
  {
    label: "Push",
    value: "push",
    description: "Receive browser or device push notifications.",
  },
];

export const DEFAULT_NOTIFICATION_FILTERS = {
  search: "",
  category: "all" as const,
  priority: "all" as const,
  status: "all" as const,
  startDate: "",
  endDate: "",
  page: 1,
  pageSize: 10,
};

export const NOTIFICATION_QUERY_KEY = ["notifications"];
export const NOTIFICATION_STATS_QUERY_KEY = [
  "notifications",
  "stats",
];

export const NOTIFICATION_PREFERENCES_QUERY_KEY = [
  "notifications",
  "preferences",
];

export const NOTIFICATION_ROUTES = {
  root: "/notifications",
  preferences: "/notifications/preferences",
};

export const DEFAULT_NOTIFICATION_PREFERENCES = {
  categories: {
    orders: {
      enabled: true,
      inApp: true,
      email: true,
      sms: false,
      push: true,
    },
    payments: {
      enabled: true,
      inApp: true,
      email: true,
      sms: true,
      push: true,
    },
    inventory: {
      enabled: true,
      inApp: true,
      email: false,
      sms: false,
      push: true,
    },
    deliveries: {
      enabled: true,
      inApp: true,
      email: true,
      sms: false,
      push: true,
    },
    customers: {
      enabled: true,
      inApp: true,
      email: false,
      sms: false,
      push: false,
    },
    system: {
      enabled: true,
      inApp: true,
      email: true,
      sms: false,
      push: true,
    },
  },
  emailAddress: "admin@example.com",
  phoneNumber: "",
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
};