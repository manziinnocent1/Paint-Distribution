import * as React from "react";
import { cn } from "../../lib/utils";

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  children,
  className,
  labelClassName,
}: FormFieldProps) {
  const fieldId = htmlFor || React.useId();

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className={cn(
            "block text-sm font-medium text-gray-700",
            labelClassName,
          )}
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="w-full">{children}</div>

      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}

      {!error && hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
