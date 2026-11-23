import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import type { ProductPrice } from "../types/pricing.types";
import { formatPrice } from "../utils/pricing.utils";
import { PriceStatusBadge } from "./PriceStatusBadge";
import { PriceTypeBadge } from "./PriceTypeBadge";

export function PricingCard({ price }: { price: ProductPrice }) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div className="min-w-0 space-y-2">
          <p className="font-semibold">{price.productName}</p>
          <p className="text-sm text-muted-foreground">
            {price.productSku} · {price.variantName || "Default variant"}
          </p>
          <div className="flex flex-wrap gap-2">
            <PriceTypeBadge type={price.priceType} />
            <PriceStatusBadge status={price.status} />
          </div>
          <p className="text-xs text-muted-foreground">
            {price.priceListName || "No price list"}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-lg font-bold">
            {formatPrice(price.sellingPrice, price.currency)}
          </p>
          <p className="text-xs text-muted-foreground">
            Base: {formatPrice(price.basePrice, price.currency)}
          </p>
          <Button variant="ghost" size="sm" asChild className="mt-2">
            <Link to={`/pricing/${price.id}`}>
              Details <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
