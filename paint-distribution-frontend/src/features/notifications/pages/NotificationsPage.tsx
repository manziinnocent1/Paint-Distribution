import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCheck, Settings, Trash2, Archive } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  NotificationFilters,
  NotificationList,
  NotificationStats,
} from "../components";

import { DEFAULT_NOTIFICATION_FILTERS } from "../constants/notification.constants";

import {
  useNotifications,
  useNotificationStats,
} from "../hooks/useNotifications";

import { useNotificationMutations } from "../hooks/useNotificationMutations";

import type {
  NotificationBulkActionValues,
  NotificationFilters as Filters,
} from "../types/notification.types";

export function NotificationsPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_NOTIFICATION_FILTERS);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading, error } = useNotifications(filters);
  const { data: stats, isLoading: statsLoading } = useNotificationStats();

  const {
    markAsRead,
    archiveNotification,
    deleteNotification,
    markAllAsRead,
    bulkAction,
  } = useNotificationMutations();

  const items = data?.results ?? [];

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((current) =>
      checked
        ? [...current, id]
        : current.filter((selectedId) => selectedId !== id),
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? items.map((item) => item.id) : []);
  };

  const runBulkAction = (action: NotificationBulkActionValues["action"]) => {
    if (!selectedIds.length) return;

    bulkAction.mutate(
      {
        notificationIds: selectedIds,
        action,
      },
      {
        onSuccess: () => setSelectedIds([]),
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review important updates from across your paint distribution
            business.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => markAllAsRead.mutate()}
            disabled={!stats?.unread || markAllAsRead.isPending}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>

          <Button variant="outline" asChild>
            <Link to="/notifications/preferences">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </Link>
          </Button>
        </div>
      </div>

      <NotificationStats stats={stats} isLoading={statsLoading} />

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Notification history</h2>
          <p className="text-sm text-muted-foreground">
            Search and manage your notifications.
          </p>
        </div>

        <NotificationFilters
          filters={filters}
          onChange={(next) => {
            setFilters(next);
            setSelectedIds([]);
          }}
          onReset={() => {
            setFilters(DEFAULT_NOTIFICATION_FILTERS);
            setSelectedIds([]);
          }}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={
                items.length > 0 &&
                items.every((item) => selectedIds.includes(item.id))
              }
              onCheckedChange={(checked) => handleSelectAll(checked === true)}
              aria-label="Select all notifications on this page"
            />

            <span className="text-sm text-muted-foreground">
              {selectedIds.length
                ? `${selectedIds.length} selected`
                : "Select notifications"}
            </span>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={bulkAction.isPending}
                onClick={() => runBulkAction("mark_read")}
              >
                <CheckCheck className="mr-1 h-4 w-4" />
                Mark read
              </Button>

              <Button
                size="sm"
                variant="outline"
                disabled={bulkAction.isPending}
                onClick={() => runBulkAction("archive")}
              >
                <Archive className="mr-1 h-4 w-4" />
                Archive
              </Button>

              <Button
                size="sm"
                variant="destructive"
                disabled={bulkAction.isPending}
                onClick={() => runBulkAction("delete")}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/30 p-6 text-sm text-destructive">
            Unable to load notifications. Please try again.
          </div>
        ) : isLoading ? (
          <div className="rounded-lg border p-10 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : (
          <>
            <NotificationList
              notifications={items}
              selectedIds={selectedIds}
              showSelection
              onSelect={handleSelect}
              onMarkRead={(id) => markAsRead.mutate(id)}
              onArchive={(id) => archiveNotification.mutate(id)}
              onDelete={(id) => deleteNotification.mutate(id)}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <p>
                Showing {items.length} of {data?.count ?? 0} notifications
              </p>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!data || data.page <= 1}
                  onClick={() => {
                    setFilters((current) => ({
                      ...current,
                      page: Math.max(1, (current.page ?? 1) - 1),
                    }));
                    setSelectedIds([]);
                  }}
                >
                  Previous
                </Button>

                <span>
                  Page {data?.page ?? 1} of {data?.totalPages ?? 1}
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={!data || data.page >= data.totalPages}
                  onClick={() => {
                    setFilters((current) => ({
                      ...current,
                      page: (current.page ?? 1) + 1,
                    }));
                    setSelectedIds([]);
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
