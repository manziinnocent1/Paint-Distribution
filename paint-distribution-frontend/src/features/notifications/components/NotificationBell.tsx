import { Link } from "react-router-dom";
import { Bell, CheckCheck, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  useRecentNotifications,
  useUnreadNotificationCount,
} from "../hooks/useNotifications";
import { useNotificationMutations } from "../hooks/useNotificationMutations";

import { NotificationList } from "./NotificationList";

export function NotificationBell() {
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const { data: recent = [], isLoading } = useRecentNotifications(5);

  const { markAsRead, markAllAsRead, archiveNotification, deleteNotification } =
    useNotificationMutations();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications, ${unreadCount} unread`}
        >
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[min(420px,calc(100vw-2rem))] p-0"
      >
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-xs text-muted-foreground">
              {unreadCount} unread notifications
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            disabled={unreadCount === 0 || markAllAsRead.isPending}
            onClick={() => markAllAsRead.mutate()}
          >
            <CheckCheck className="mr-1 h-4 w-4" />
            Read all
          </Button>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {isLoading ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              Loading notifications...
            </p>
          ) : (
            <NotificationList
              notifications={recent}
              compact
              onMarkRead={(id) => markAsRead.mutate(id)}
              onArchive={(id) => archiveNotification.mutate(id)}
              onDelete={(id) => deleteNotification.mutate(id)}
              emptyTitle="No new notifications"
              emptyDescription="You're all caught up."
            />
          )}
        </div>

        <div className="flex items-center justify-between border-t p-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/notifications">View all notifications</Link>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link
              to="/notifications/preferences"
              aria-label="Notification preferences"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
