import type {
  AppNotification,
  NotificationBulkActionValues,
  NotificationFilters,
  NotificationPreferences,
  NotificationPreferenceValues,
  NotificationStats,
  PaginatedNotifications,
} from "../types/notification.types";

import { DEFAULT_NOTIFICATION_PREFERENCES } from "../constants/notification.constants";

const daysAgo = (days: number, hours = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};

let notifications: AppNotification[] = [
  {
    id: "notification-001",
    title: "New order received",
    message:
      "A new customer order has been submitted and is waiting for processing.",
    category: "orders",
    priority: "high",
    status: "unread",
    channels: ["in_app", "email"],
    referenceNumber: "ORD-2026-001",
    action: {
      label: "View order",
      type: "view_order",
      referenceId: "order-001",
    },
    sender: "Order Management",
    createdAt: daysAgo(0, 1),
  },
  {
    id: "notification-002",
    title: "Low inventory alert",
    message:
      "Weather Guard Exterior Paint has reached its minimum stock threshold.",
    category: "inventory",
    priority: "urgent",
    status: "unread",
    channels: ["in_app", "push"],
    referenceNumber: "WGP-002",
    action: {
      label: "View stock",
      type: "view_inventory",
      referenceId: "stock-002",
    },
    sender: "Inventory Management",
    createdAt: daysAgo(0, 3),
  },
  {
    id: "notification-003",
    title: "Payment received",
    message:
      "A customer payment has been successfully recorded.",
    category: "payments",
    priority: "normal",
    status: "unread",
    channels: ["in_app", "email"],
    referenceNumber: "PAY-2026-001",
    action: {
      label: "View payment",
      type: "view_payment",
      referenceId: "payment-001",
    },
    sender: "Payment Management",
    createdAt: daysAgo(0, 5),
  },
  {
    id: "notification-004",
    title: "Delivery assigned",
    message:
      "A new delivery has been assigned to a delivery team.",
    category: "deliveries",
    priority: "normal",
    status: "read",
    channels: ["in_app", "push"],
    referenceNumber: "DEL-2026-001",
    action: {
      label: "View delivery",
      type: "view_delivery",
      referenceId: "delivery-001",
    },
    sender: "Delivery Management",
    createdAt: daysAgo(1, 2),
    readAt: daysAgo(1, 1),
  },
  {
    id: "notification-005",
    title: "New customer registered",
    message:
      "A new customer account has been created in the system.",
    category: "customers",
    priority: "low",
    status: "read",
    channels: ["in_app"],
    referenceNumber: "CUS-2026-001",
    action: {
      label: "View customer",
      type: "view_customer",
      referenceId: "customer-001",
    },
    sender: "Customer Management",
    createdAt: daysAgo(2),
    readAt: daysAgo(2),
  },
  {
    id: "notification-006",
    title: "System maintenance notice",
    message:
      "Scheduled maintenance is planned. Save your work before the maintenance window.",
    category: "system",
    priority: "high",
    status: "read",
    channels: ["in_app", "email"],
    action: {
      label: "View settings",
      type: "view_settings",
    },
    sender: "System Administrator",
    createdAt: daysAgo(3),
    readAt: daysAgo(3),
  },
  {
    id: "notification-007",
    title: "Order processing completed",
    message:
      "The order has completed its processing stage.",
    category: "orders",
    priority: "normal",
    status: "archived",
    channels: ["in_app"],
    referenceNumber: "ORD-2026-002",
    action: {
      label: "View order",
      type: "view_order",
      referenceId: "order-002",
    },
    sender: "Order Management",
    createdAt: daysAgo(5),
    readAt: daysAgo(5),
    archivedAt: daysAgo(4),
  },
  {
    id: "notification-008",
    title: "Delivery successfully completed",
    message:
      "The delivery team has confirmed successful delivery to the customer.",
    category: "deliveries",
    priority: "normal",
    status: "read",
    channels: ["in_app", "push"],
    referenceNumber: "DEL-2026-002",
    action: {
      label: "View delivery",
      type: "view_delivery",
      referenceId: "delivery-002",
    },
    sender: "Delivery Management",
    createdAt: daysAgo(7),
    readAt: daysAgo(7),
  },
];

let preferences: NotificationPreferences = {
  ...DEFAULT_NOTIFICATION_PREFERENCES,
  categories: Object.fromEntries(
    Object.entries(DEFAULT_NOTIFICATION_PREFERENCES.categories).map(
      ([key, value]) => [key, { ...value }],
    ),
  ) as NotificationPreferences["categories"],
};

function paginate(
  items: AppNotification[],
  page = 1,
  pageSize = 10,
): PaginatedNotifications {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const start = (safePage - 1) * safePageSize;

  return {
    results: items.slice(start, start + safePageSize),
    count: items.length,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.max(1, Math.ceil(items.length / safePageSize)),
  };
}

function findNotification(id: string): AppNotification {
  const notification = notifications.find((item) => item.id === id);

  if (!notification) {
    throw new Error("Notification not found.");
  }

  return notification;
}

export const notificationService = {
  async getAll(
    filters: NotificationFilters = {},
  ): Promise<PaginatedNotifications> {
    let result = [...notifications];

    if (filters.search?.trim()) {
      const search = filters.search.toLowerCase();

      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(search) ||
          item.message.toLowerCase().includes(search) ||
          item.referenceNumber?.toLowerCase().includes(search) ||
          item.sender?.toLowerCase().includes(search),
      );
    }

    if (filters.category && filters.category !== "all") {
      result = result.filter(
        (item) => item.category === filters.category,
      );
    }

    if (filters.priority && filters.priority !== "all") {
      result = result.filter(
        (item) => item.priority === filters.priority,
      );
    }

    if (filters.status && filters.status !== "all") {
      result = result.filter(
        (item) => item.status === filters.status,
      );
    }

    if (filters.startDate) {
      result = result.filter(
        (item) =>
          new Date(item.createdAt) >= new Date(filters.startDate!),
      );
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);

      result = result.filter(
        (item) => new Date(item.createdAt) <= end,
      );
    }

    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );

    return paginate(result, filters.page, filters.pageSize);
  },

  async getById(id: string): Promise<AppNotification> {
    return findNotification(id);
  },

  async getRecent(limit = 5): Promise<AppNotification[]> {
    return [...notifications]
      .filter((item) => item.status !== "archived")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);
  },

  async getStats(): Promise<NotificationStats> {
    return {
      total: notifications.filter(
        (item) => item.status !== "archived",
      ).length,
      unread: notifications.filter(
        (item) => item.status === "unread",
      ).length,
      read: notifications.filter(
        (item) => item.status === "read",
      ).length,
      archived: notifications.filter(
        (item) => item.status === "archived",
      ).length,
      urgent: notifications.filter(
        (item) =>
          item.priority === "urgent" &&
          item.status !== "archived",
      ).length,
    };
  },

  async getUnreadCount(): Promise<number> {
    return notifications.filter(
      (item) => item.status === "unread",
    ).length;
  },

  async markAsRead(id: string): Promise<AppNotification> {
    const existing = findNotification(id);

    const updated: AppNotification = {
      ...existing,
      status: "read",
      readAt: new Date().toISOString(),
    };

    notifications = notifications.map((item) =>
      item.id === id ? updated : item,
    );

    return updated;
  },

  async markAsUnread(id: string): Promise<AppNotification> {
    const existing = findNotification(id);

    const updated: AppNotification = {
      ...existing,
      status: "unread",
      readAt: undefined,
      archivedAt: undefined,
    };

    notifications = notifications.map((item) =>
      item.id === id ? updated : item,
    );

    return updated;
  },

  async markAllAsRead(): Promise<void> {
    const now = new Date().toISOString();

    notifications = notifications.map((item) =>
      item.status === "unread"
        ? {
            ...item,
            status: "read",
            readAt: now,
          }
        : item,
    );
  },

  async archive(id: string): Promise<AppNotification> {
    const existing = findNotification(id);

    const updated: AppNotification = {
      ...existing,
      status: "archived",
      archivedAt: new Date().toISOString(),
    };

    notifications = notifications.map((item) =>
      item.id === id ? updated : item,
    );

    return updated;
  },

  async delete(id: string): Promise<void> {
    findNotification(id);
    notifications = notifications.filter((item) => item.id !== id);
  },

  async bulkAction(
    values: NotificationBulkActionValues,
  ): Promise<void> {
    const selectedIds = new Set(values.notificationIds);
    const now = new Date().toISOString();

    if (values.action === "delete") {
      notifications = notifications.filter(
        (item) => !selectedIds.has(item.id),
      );
      return;
    }

    notifications = notifications.map((item) => {
      if (!selectedIds.has(item.id)) return item;

      switch (values.action) {
        case "mark_read":
          return {
            ...item,
            status: "read",
            readAt: now,
          };

        case "mark_unread":
          return {
            ...item,
            status: "unread",
            readAt: undefined,
            archivedAt: undefined,
          };

        case "archive":
          return {
            ...item,
            status: "archived",
            archivedAt: now,
          };

        default:
          return item;
      }
    });
  },

  async getPreferences(): Promise<NotificationPreferences> {
    return {
      ...preferences,
      categories: Object.fromEntries(
        Object.entries(preferences.categories).map(
          ([key, value]) => [key, { ...value }],
        ),
      ) as NotificationPreferences["categories"],
    };
  },

  async updatePreferences(
    values: NotificationPreferenceValues,
  ): Promise<NotificationPreferences> {
    preferences = {
      ...values,
      updatedAt: new Date().toISOString(),
    };

    return this.getPreferences();
  },

  async create(
    values: Omit<
      AppNotification,
      "id" | "createdAt" | "status" | "readAt" | "archivedAt"
    >,
  ): Promise<AppNotification> {
    const notification: AppNotification = {
      ...values,
      id: crypto.randomUUID(),
      status: "unread",
      createdAt: new Date().toISOString(),
    };

    notifications = [notification, ...notifications];

    return notification;
  },
};