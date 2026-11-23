import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, History, Pencil, SlidersHorizontal } from "lucide-react";
import type { ProductPrice } from "../types/pricing.types";
import { formatPrice, formatPricingDate } from "../utils/pricing.utils";
import { PriceStatusBadge } from "./PriceStatusBadge";
import { PriceTypeBadge } from "./PriceTypeBadge";
import { PriceAdjustmentForm } from "./PriceAdjustmentForm";

export function PricingDetails({ price }: { price: ProductPrice }) {
  const [adjustOpen, setAdjustOpen] = useState(false);

  const details = [
    ["Product", price.productName],
    ["Product SKU", price.productSku],
    ["Variant", price.variantName || "Default variant"],
    ["Price list", price.priceListName || "Not assigned"],
    ["Currency", price.currency],
    ["Effective from", formatPricingDate(price.effectiveFrom)],
    ["Effective until", formatPricingDate(price.effectiveTo)],
    ["Created", formatPricingDate(price.createdAt)],
    ["Last updated", formatPricingDate(price.updatedAt)],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" asChild>
          <Link to="/pricing">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to pricing
          </Link>
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to={`/pricing/${price.id}/history`}>
              <History className="mr-2 h-4 w-4" />
              Price history
            </Link>
          </Button>

          <Button variant="outline" onClick={() => setAdjustOpen(true)}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Adjust price
          </Button>

          <Button asChild>
            <Link to={`/pricing/${price.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit price
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>{price.productName}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {price.productSku}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <PriceTypeBadge type={price.priceType} />
            <PriceStatusBadge status={price.status} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Base price</p>
              <p className="text-2xl font-semibold">
                {formatPrice(price.basePrice, price.currency)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Selling price</p>
              <p className="text-2xl font-bold">
                {formatPrice(price.sellingPrice, price.currency)}
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {details.map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 break-words text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Discount</p>
              <p className="mt-1 font-semibold">
                {price.discountPercentage ?? 0}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Minimum price</p>
              <p className="mt-1 font-semibold">
                {price.minimumPrice !== undefined
                  ? formatPrice(price.minimumPrice, price.currency)
                  : "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Maximum price</p>
              <p className="mt-1 font-semibold">
                {price.maximumPrice !== undefined
                  ? formatPrice(price.maximumPrice, price.currency)
                  : "Not set"}
              </p>
            </div>
          </div>

          {price.description && (
            <div>
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="mt-1 text-sm">{price.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <PriceAdjustmentForm
        price={price}
        open={adjustOpen}
        onOpenChange={setAdjustOpen}
      />
    </div>
  );
}
