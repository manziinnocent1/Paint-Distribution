import { useQuery } from "@tanstack/react-query";

import { notificationService } from "../services/notificationService";

import {
  NOTIFICATION_PREFERENCES_QUERY_KEY,
} from "../constants/notification.constants";

export function useNotificationPreferences() {
  return useQuery({
    queryKey: NOTIFICATION_PREFERENCES_QUERY_KEY,
    queryFn: notificationService.getPreferences,
  });
}