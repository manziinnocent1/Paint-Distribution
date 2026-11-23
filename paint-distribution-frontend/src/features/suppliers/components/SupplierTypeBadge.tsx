import { Badge } from "@/components/ui/badge";
import { getSupplierTypeLabel } from "../utils/supplier.utils";
import type { SupplierType } from "../types/supplier.types";

export function SupplierTypeBadge({ type }: { type: SupplierType }) {
  return <Badge variant="outline">{getSupplierTypeLabel(type)}</Badge>;
}
