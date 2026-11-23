import { Link } from "react-router-dom";
import {
  Bell,
  CreditCard,
  Package,
  ShoppingCart,
  Truck,
  Users,
  Settings,
  Check,
  Archive,
  Trash2,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import type { AppNotification } from "../types/notification.types";

import {
  getCategoryLabel,
  getNotificationDestination,
  getRelativeNotificationTime,
} from "../utils/notification.utils";

import {
  NotificationPriorityBadge,
  NotificationStatusBadge,
} from "./NotificationBadge";

interface Props {
  notification: AppNotification;
  selected?: boolean;
  showSelection?: boolean;
  compact?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
  onMarkRead?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const categoryIcons = {
  orders: ShoppingCart,
  payments: CreditCard,
  inventory: Package,
  deliveries: Truck,
  customers: Users,
  system: Settings,
};

export function NotificationItem({
  notification,
  selected = false,
  showSelection = false,
  compact = false,
  onSelect,
  onMarkRead,
  onArchive,
  onDelete,
}: Props) {
  const Icon = categoryIcons[notification.category] ?? Bell;

  const destination = getNotificationDestination(notification.action);

  return (
    <div
      className={`flex gap-3 border-b p-4 last:border-b-0 ${
        notification.status === "unread" ? "bg-primary/[0.035]" : ""
      }`}
    >
      {showSelection && (
        <div className="pt-1">
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) =>
              onSelect?.(notification.id, checked === true)
            }
            aria-label={`Select ${notification.title}`}
          />
        </div>
      )}

      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`text-sm ${
                  notification.status === "unread"
                    ? "font-semibold"
                    : "font-medium"
                }`}
              >
                {notification.title}
              </h3>

              {notification.status === "unread" && (
                <span
                  className="h-2 w-2 rounded-full bg-primary"
                  aria-label="Unread"
                />
              )}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              {getCategoryLabel(notification.category)} ·{" "}
              {getRelativeNotificationTime(notification.createdAt)}
            </p>
          </div>

          {!compact && (
            <NotificationPriorityBadge priority={notification.priority} />
          )}
        </div>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {notification.message}
        </p>

        {notification.referenceNumber && (
          <p className="mt-2 text-xs text-muted-foreground">
            Reference: {notification.referenceNumber}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {destination && (
            <Button size="sm" variant="outline" asChild>
              <Link to={destination}>
                {notification.action?.label ?? "View details"}
                <ExternalLink className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          )}

          {notification.status !== "read" &&
            notification.status !== "archived" && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMarkRead?.(notification.id)}
              >
                <Check className="mr-1 h-4 w-4" />
                Mark read
              </Button>
            )}

          {notification.status !== "archived" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onArchive?.(notification.id)}
            >
              <Archive className="mr-1 h-4 w-4" />
              Archive
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete?.(notification.id)}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
