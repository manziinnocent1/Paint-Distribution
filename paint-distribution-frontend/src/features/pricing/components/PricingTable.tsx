import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProductPrice } from "../types/pricing.types";
import { formatPrice, formatPricingDate } from "../utils/pricing.utils";
import { PriceStatusBadge } from "./PriceStatusBadge";
import { PriceTypeBadge } from "./PriceTypeBadge";

export function PricingTable({ prices }: { prices: ProductPrice[] }) {
  if (!prices.length) {
    return (
      <div className="rounded-lg border p-10 text-center text-sm text-muted-foreground">
        No pricing records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU / Variant</TableHead>
            <TableHead>Price type</TableHead>
            <TableHead>Base price</TableHead>
            <TableHead>Selling price</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Effective from</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {prices.map((price) => (
            <TableRow key={price.id}>
              <TableCell>
                <div className="font-medium">{price.productName}</div>
                {price.priceListName && (
                  <div className="text-xs text-muted-foreground">
                    {price.priceListName}
                  </div>
                )}
              </TableCell>

              <TableCell>
                <div>{price.productSku}</div>
                <div className="text-xs text-muted-foreground">
                  {price.variantName || "Default variant"}
                </div>
              </TableCell>

              <TableCell>
                <PriceTypeBadge type={price.priceType} />
              </TableCell>

              <TableCell>
                {formatPrice(price.basePrice, price.currency)}
              </TableCell>

              <TableCell className="font-semibold">
                {formatPrice(price.sellingPrice, price.currency)}
              </TableCell>

              <TableCell>
                {price.discountPercentage
                  ? `${price.discountPercentage}%`
                  : "—"}
              </TableCell>

              <TableCell>
                <PriceStatusBadge status={price.status} />
              </TableCell>

              <TableCell>{formatPricingDate(price.effectiveFrom)}</TableCell>

              <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/pricing/${price.id}`}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View price</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
