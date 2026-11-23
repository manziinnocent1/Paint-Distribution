import type {
  ProcurementItem,
  PurchaseOrderItem,
} from "../types/procurement.types";
import { formatProcurementCurrency } from "../utils/procurement.utils";

interface Props {
  items: (ProcurementItem | PurchaseOrderItem)[];
  mode?: "request" | "order";
}

export function ProcurementItemsTable({ items, mode = "request" }: Props) {
  const getPrice = (item: ProcurementItem | PurchaseOrderItem) =>
    mode === "request"
      ? (item as ProcurementItem).estimatedUnitPrice
      : (item as PurchaseOrderItem).unitPrice;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-left">
            <th className="p-3">Product</th>
            <th className="p-3">SKU</th>
            <th className="p-3 text-right">Quantity</th>
            <th className="p-3 text-right">Unit price</th>
            <th className="p-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-3 font-medium">{item.productName}</td>
              <td className="p-3">{item.sku}</td>
              <td className="p-3 text-right">{item.quantity}</td>
              <td className="p-3 text-right">
                {formatProcurementCurrency(getPrice(item))}
              </td>
              <td className="p-3 text-right font-medium">
                {formatProcurementCurrency(item.quantity * getPrice(item))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
