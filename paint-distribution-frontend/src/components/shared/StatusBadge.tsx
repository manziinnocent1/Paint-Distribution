import * as React from "react";
import { Badge, type BadgeVariant } from "@/components/ui";

export type BusinessStatus =
  | "active"
  | "inactive"
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "cancelled"
  | "processing"
  | "in_progress"
  | "paid"
  | "unpaid"
  | "partially_paid"
  | "overdue"
  | "draft"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "returned"
  | "low_stock"
  | "out_of_stock"
  | "in_stock"
  | "received"
  | "open"
  | "closed"
  | "unknown";

interface StatusConfig {
  label: string;
  variant: BadgeVariant;
}

const statusConfig: Record<BusinessStatus, StatusConfig> = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "default" },
  pending: { label: "Pending", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
  processing: { label: "Processing", variant: "info" },
  in_progress: { label: "In Progress", variant: "info" },
  paid: { label: "Paid", variant: "success" },
  unpaid: { label: "Unpaid", variant: "danger" },
  partially_paid: { label: "Partially Paid", variant: "warning" },
  overdue: { label: "Overdue", variant: "danger" },
  draft: { label: "Draft", variant: "default" },
  confirmed: { label: "Confirmed", variant: "success" },
  shipped: { label: "Shipped", variant: "info" },
  delivered: { label: "Delivered", variant: "success" },
  returned: { label: "Returned", variant: "warning" },
  low_stock: { label: "Low Stock", variant: "warning" },
  out_of_stock: { label: "Out of Stock", variant: "danger" },
  in_stock: { label: "In Stock", variant: "success" },
  received: { label: "Received", variant: "success" },
  open: { label: "Open", variant: "info" },
  closed: { label: "Closed", variant: "default" },
  unknown: { label: "Unknown", variant: "default" },
};

export interface StatusBadgeProps {
  status: string;
  label?: string;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  label,
  showDot = true,
  className,
}: StatusBadgeProps) {
  const normalizedStatus = status
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_") as BusinessStatus;

  const config = statusConfig[normalizedStatus] ?? statusConfig.unknown;

  return (
    <Badge variant={config.variant} dot={showDot} className={className}>
      {label || config.label}
    </Badge>
  );
}
