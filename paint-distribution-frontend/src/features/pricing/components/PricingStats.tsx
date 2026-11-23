import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tags,
  CheckCircle2,
  CalendarClock,
  CalendarX,
  TrendingDown,
} from "lucide-react";
import { usePricingStats } from "../hooks/usePricing";
import { formatPrice } from "../utils/pricing.utils";

export function PricingStats() {
  const { data, isLoading } = usePricingStats();

  const items = [
    {
      label: "Total prices",
      value: data?.totalPrices ?? 0,
      icon: Tags,
      type: "number",
    },
    {
      label: "Active prices",
      value: data?.activePrices ?? 0,
      icon: CheckCircle2,
      type: "number",
    },
    {
      label: "Scheduled prices",
      value: data?.scheduledPrices ?? 0,
      icon: CalendarClock,
      type: "number",
    },
    {
      label: "Expired prices",
      value: data?.expiredPrices ?? 0,
      icon: CalendarX,
      type: "number",
    },
    {
      label: "Total discounts",
      value: data?.totalDiscounts ?? 0,
      icon: TrendingDown,
      type: "money",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {item.label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {isLoading
                  ? "..."
                  : item.type === "money"
                    ? formatPrice(Number(item.value))
                    : item.value.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
