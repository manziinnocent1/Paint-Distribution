import * as React from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AlertVariant = "success" | "error" | "warning" | "info";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const styles = {
  success: {
    wrapper: "border-green-200 bg-green-50 text-green-800",
    icon: "text-green-600",
    Icon: CheckCircle2,
  },
  error: {
    wrapper: "border-red-200 bg-red-50 text-red-800",
    icon: "text-red-600",
    Icon: AlertCircle,
  },
  warning: {
    wrapper: "border-yellow-200 bg-yellow-50 text-yellow-800",
    icon: "text-yellow-600",
    Icon: AlertTriangle,
  },
  info: {
    wrapper: "border-blue-200 bg-blue-50 text-blue-800",
    icon: "text-blue-600",
    Icon: Info,
  },
};

export function Alert({
  variant = "info",
  title,
  description,
  children,
  dismissible = false,
  onDismiss,
  className,
  ...props
}: AlertProps) {
  const config = styles[variant];
  const Icon = config.Icon;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4",
        config.wrapper,
        className,
      )}
      {...props}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.icon)} />

      <div className="min-w-0 flex-1">
        {title && <h4 className="text-sm font-semibold">{title}</h4>}

        {(description || children) && (
          <div className={cn("text-sm", title && "mt-1")}>
            {description}
            {children}
          </div>
        )}
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="shrink-0 rounded p-1 opacity-70 hover:bg-black/5 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
