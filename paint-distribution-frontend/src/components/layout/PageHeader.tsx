import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  backButton?: boolean;
  onBack?: () => void;
  className?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  backButton = false,
  onBack,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-4 sm:flex-row sm:items-center",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {backButton && (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="mt-1 rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}

        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
              {eyebrow}
            </p>
          )}

          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            {title}
          </h1>

          {description && (
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
