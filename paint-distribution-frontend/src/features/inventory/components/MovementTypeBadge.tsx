import { Badge } from "@/components/ui/badge";
import type { MovementType } from "../types/inventory.types";
import { getMovementLabel } from "../utils/inventory.utils";

const styles: Record<MovementType, string> = {
  stock_in: "bg-green-100 text-green-700 hover:bg-green-100",
  stock_out: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  adjustment: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  transfer: "bg-purple-100 text-purple-700 hover:bg-purple-100",
};

interface Props {
  type: MovementType;
}

export function MovementTypeBadge({ type }: Props) {
  return <Badge className={styles[type]}>{getMovementLabel(type)}</Badge>;
}
