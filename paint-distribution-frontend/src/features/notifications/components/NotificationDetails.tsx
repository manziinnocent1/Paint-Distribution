import { Link } from "react-router-dom";
import { ArrowLeft, Bell, CalendarDays, User, Tag, Hash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { AppNotification } from "../types/notification.types";

import {
  formatNotificationDate,
  getCategoryLabel,
  getNotificationDestination,
} from "../utils/notification.utils";

import {
  NotificationPriorityBadge,
  NotificationStatusBadge,
} from "./NotificationBadge";

interface Props {
  notification: AppNotification;
  onMarkRead: () => void;
  onMarkUnread: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export function NotificationDetails({
  notification,
  onMarkRead,
  onMarkUnread,
  onArchive,
  onDelete,
}: Props) {
  const destination = getNotificationDestination(notification.action);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/notifications">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to notifications
        </Link>
      </Button>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Bell className="h-6 w-6 text-primary" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  {getCategoryLabel(notification.category)}
                </p>
                <h1 className="text-xl font-bold">{notification.title}</h1>
              </div>
            </div>

            <NotificationPriorityBadge priority={notification.priority} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="whitespace-pre-wrap text-sm leading-7">
            {notification.message}
          </p>

          {destination && (
            <Button asChild>
              <Link to={destination}>
                {notification.action?.label ?? "View related record"}
              </Link>
            </Button>
          )}

          <Separator />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Tag className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="text-sm font-medium">
                  {getCategoryLabel(notification.category)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Bell className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <NotificationStatusBadge status={notification.status} />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm font-medium">
                  {formatNotificationDate(notification.createdAt)}
                </p>
              </div>
            </div>

            {notification.readAt && (
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Read at</p>
                  <p className="text-sm font-medium">
                    {formatNotificationDate(notification.readAt)}
                  </p>
                </div>
              </div>
            )}

            {notification.sender && (
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Source</p>
                  <p className="text-sm font-medium">{notification.sender}</p>
                </div>
              </div>
            )}

            {notification.referenceNumber && (
              <div className="flex items-start gap-3">
                <Hash className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Reference</p>
                  <p className="text-sm font-medium">
                    {notification.referenceNumber}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <p className="mb-2 text-sm font-semibold">Delivery channels</p>

            <div className="flex flex-wrap gap-2">
              {notification.channels.map((channel) => (
                <span
                  key={channel}
                  className="rounded-md bg-muted px-3 py-1.5 text-xs"
                >
                  {channel.replace("_", " ")}
                </span>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2">
            {notification.status === "unread" ? (
              <Button onClick={onMarkRead}>Mark as read</Button>
            ) : notification.status === "read" ? (
              <Button variant="outline" onClick={onMarkUnread}>
                Mark as unread
              </Button>
            ) : null}

            {notification.status !== "archived" && (
              <Button variant="outline" onClick={onArchive}>
                Archive
              </Button>
            )}

            <Button variant="destructive" onClick={onDelete}>
              Delete notification
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
