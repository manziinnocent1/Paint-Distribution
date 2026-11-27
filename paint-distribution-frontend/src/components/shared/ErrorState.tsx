import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../../components/ui";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the requested information. Please try again.",
  onRetry,
  retryText = "Try again",
  className = "",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50/50 px-6 py-12 text-center ${className}`}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>

      <h3 className="text-base font-semibold text-gray-900">{title}</h3>

      <p className="mt-2 max-w-md text-sm text-gray-500">{message}</p>

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RefreshCw className="h-4 w-4" />}
          onClick={onRetry}
          className="mt-5"
        >
          {retryText}
        </Button>
      )}
    </div>
  );
}
