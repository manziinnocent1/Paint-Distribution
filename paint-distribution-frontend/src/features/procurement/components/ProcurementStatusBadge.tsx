import { Badge } from "@/components/ui/badge";
import type {
  GoodsReceiptStatus,
  ProcurementPriority,
  ProcurementStatus,
  PurchaseOrderStatus,
} from "../types/procurement.types";
import { getProcurementStatusLabel } from "../utils/procurement.utils";

const statusStyles: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  ordered: "bg-blue-100 text-blue-800",
  sent: "bg-indigo-100 text-indigo-800",
  partially_received: "bg-orange-100 text-orange-800",
  received: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-gray-100 text-gray-600",
  inspected: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
};

const priorityStyles: Record<ProcurementPriority, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

export function ProcurementStatusBadge({
  status,
}: {
  status: ProcurementStatus | PurchaseOrderStatus | GoodsReceiptStatus;
}) {
  return (
    <Badge
      variant="outline"
      className={statusStyles[status] ?? "bg-slate-100 text-slate-700"}
    >
      {getProcurementStatusLabel(status)}
    </Badge>
  );
}

export function ProcurementPriorityBadge({
  priority,
}: {
  priority: ProcurementPriority;
}) {
  return (
    <Badge variant="outline" className={priorityStyles[priority]}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}
