import { Badge } from "@/components/ui/badge";
import type { PriceStatus } from "../types/pricing.types";

const styles: Record<PriceStatus, string> = {
  active: "bg-green-100 text-green-800 hover:bg-green-100",
  scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  expired: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  inactive: "bg-red-100 text-red-800 hover:bg-red-100",
};

export function PriceStatusBadge({ status }: { status: PriceStatus }) {
  return (
    <Badge variant="secondary" className={styles[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
