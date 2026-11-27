import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, hint, leftElement, rightElement, className, id, ...props },
    ref,
  ) => {
    const inputId = id || React.useId();

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "flex items-center rounded-lg border bg-white transition-colors",
            error
              ? "border-red-500 focus-within:ring-2 focus-within:ring-red-100"
              : "border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100",
          )}
        >
          {leftElement && (
            <span className="pl-3 text-gray-400">{leftElement}</span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-transparent px-3 py-2.5 text-sm text-gray-900",
              "placeholder:text-gray-400 focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />

          {rightElement && (
            <span className="pr-3 text-gray-400">{rightElement}</span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-600">
            {error}
          </p>
        )}

        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
