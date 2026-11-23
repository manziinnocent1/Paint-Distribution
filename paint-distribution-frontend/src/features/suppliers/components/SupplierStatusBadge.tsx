import { Badge } from "@/components/ui/badge";
import type { SupplierStatus } from "../types/supplier.types";

const styles: Record<SupplierStatus, string> = {
  active: "bg-green-100 text-green-700 hover:bg-green-100",
  inactive: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  suspended: "bg-red-100 text-red-700 hover:bg-red-100",
};

export function SupplierStatusBadge({ status }: { status: SupplierStatus }) {
  return (
    <Badge className={styles[status]} variant="secondary">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
