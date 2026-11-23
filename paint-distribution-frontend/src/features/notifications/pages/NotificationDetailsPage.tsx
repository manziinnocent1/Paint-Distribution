import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { NotificationDetails } from "../components";
import { useNotification } from "../hooks/useNotification";
import { useNotificationMutations } from "../hooks/useNotificationMutations";

export function NotificationDetailsPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const { data: notification, isLoading, error } = useNotification(id);

  const { markAsRead, markAsUnread, archiveNotification, deleteNotification } =
    useNotificationMutations();

  useEffect(() => {
    if (notification?.status === "unread") {
      markAsRead.mutate(notification.id);
    }
    // Mark this notification as read when the details page is opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification?.id]);

  const handleDelete = async () => {
    if (!notification) return;

    await deleteNotification.mutateAsync(notification.id);
    navigate("/notifications");
  };

  const handleArchive = async () => {
    if (!notification) return;

    await archiveNotification.mutateAsync(notification.id);
    navigate("/notifications");
  };

  if (isLoading) {
    return (
      <p className="p-6 text-sm text-muted-foreground">
        Loading notification...
      </p>
    );
  }

  if (error || !notification) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <h2 className="font-semibold">Notification not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This notification may have been deleted or is unavailable.
        </p>
      </div>
    );
  }

  return (
    <NotificationDetails
      notification={notification}
      onMarkRead={() => markAsRead.mutate(notification.id)}
      onMarkUnread={() => markAsUnread.mutate(notification.id)}
      onArchive={handleArchive}
      onDelete={handleDelete}
    />
  );
}
