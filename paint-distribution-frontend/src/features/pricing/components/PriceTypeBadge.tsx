import { Badge } from "@/components/ui/badge";
import type { PriceType } from "../types/pricing.types";
import { getPriceTypeLabel } from "../utils/pricing.utils";

export function PriceTypeBadge({ type }: { type: PriceType }) {
  return <Badge variant="outline">{getPriceTypeLabel(type)}</Badge>;
}
