import { Badge } from "@/components/ui/badge";
import type { StockStatus } from "../types/inventory.types";
import { getStockStatusLabel } from "../utils/inventory.utils";

const styles: Record<StockStatus, string> = {
  in_stock: "bg-green-100 text-green-700 hover:bg-green-100",
  low_stock: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  out_of_stock: "bg-red-100 text-red-700 hover:bg-red-100",
};

interface Props {
  status: StockStatus;
}

export function StockStatusBadge({ status }: Props) {
  return (
    <Badge className={styles[status]}>{getStockStatusLabel(status)}</Badge>
  );
}
