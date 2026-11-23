import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SupplierEmptyStateProps {
  onCreate?: () => void;
  title?: string;
  description?: string;
}

export function SupplierEmptyState({
  onCreate,
  title = "No suppliers found",
  description = "Add a supplier to start managing your supply network.",
}: SupplierEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Building2 className="h-8 w-8 text-muted-foreground" />
      </div>

      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      {onCreate && (
        <Button className="mt-5" onClick={onCreate}>
          Add supplier
        </Button>
      )}
    </div>
  );
}
