import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePriceHistory } from "../hooks/usePriceHistory";
import { formatPrice, formatPricingDate } from "../utils/pricing.utils";

export function PriceHistory({ priceId }: { priceId: string }) {
  const { data, isLoading, isError } = usePriceHistory(priceId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price history</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">
            Loading price history...
          </p>
        ) : isError ? (
          <p className="text-sm text-destructive">
            Unable to load price history.
          </p>
        ) : !data?.length ? (
          <p className="text-sm text-muted-foreground">
            No price changes have been recorded.
          </p>
        ) : (
          <div className="space-y-5">
            {data.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-2 border-b pb-4 last:border-0 last:pb-0 sm:flex-row"
              >
                <div>
                  <p className="font-medium">{item.reason}</p>
                  <p className="text-xs text-muted-foreground">
                    Changed by {item.changedBy}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPricingDate(item.changedAt)}
                  </p>
                </div>

                <div className="text-sm sm:text-right">
                  <p>
                    {formatPrice(item.previousPrice, item.currency)}
                    {" → "}
                    <span className="font-semibold">
                      {formatPrice(item.newPrice, item.currency)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
