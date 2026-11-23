import { useQuery } from "@tanstack/react-query";

import { notificationService } from "../services/notificationService";

import {
  NOTIFICATION_QUERY_KEY,
  NOTIFICATION_STATS_QUERY_KEY,
} from "../constants/notification.constants";

import type { NotificationFilters } from "../types/notification.types";

export function useNotifications(
  filters: NotificationFilters = {},
) {
  return useQuery({
    queryKey: [...NOTIFICATION_QUERY_KEY, filters],
    queryFn: () => notificationService.getAll(filters),
  });
}

export function useNotificationStats() {
  return useQuery({
    queryKey: NOTIFICATION_STATS_QUERY_KEY,
    queryFn: notificationService.getStats,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: [...NOTIFICATION_QUERY_KEY, "unread-count"],
    queryFn: notificationService.getUnreadCount,
  });
}

export function useRecentNotifications(limit = 5) {
  return useQuery({
    queryKey: [...NOTIFICATION_QUERY_KEY, "recent", limit],
    queryFn: () => notificationService.getRecent(limit),
  });
}