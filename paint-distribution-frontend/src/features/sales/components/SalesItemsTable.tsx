import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SaleItem } from "../types/sales.types";
import { formatSaleCurrency } from "../utils/sales.utils";

type Props = {
  items: SaleItem[];
};

export function SalesItemsTable({ items }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Unit price</TableHead>
            <TableHead className="text-right">Discount</TableHead>
            <TableHead className="text-right">Tax</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="font-medium">{item.productName}</div>
                {item.variantName && (
                  <div className="text-xs text-muted-foreground">
                    {item.variantName}
                  </div>
                )}
              </TableCell>
              <TableCell>{item.productSku}</TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">
                {formatSaleCurrency(item.unitPrice)}
              </TableCell>
              <TableCell className="text-right">
                {item.discountPercentage}%
              </TableCell>
              <TableCell className="text-right">
                {item.taxPercentage}%
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatSaleCurrency(item.total)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
