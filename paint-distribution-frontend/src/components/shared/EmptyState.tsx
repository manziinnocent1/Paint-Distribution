import * as React from "react";
import { Inbox, Plus } from "lucide-react";
import { Button } from "@/components/ui";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = "No data found",
  description = "There are currently no records to display.",
  icon,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center ${className}`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        {icon || <Inbox className="h-7 w-7" />}
      </div>

      <h3 className="text-base font-semibold text-gray-900">{title}</h3>

      <p className="mt-2 max-w-md text-sm text-gray-500">{description}</p>

      {actionLabel && onAction && (
        <Button
          size="sm"
          className="mt-5"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
