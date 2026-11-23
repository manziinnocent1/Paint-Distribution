import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Banknote,
  CheckCircle2,
  Clock3,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { usePaymentStats } from "../hooks/usePayments";
import { formatPaymentAmount } from "../utils/payment.utils";

export function PaymentStats() {
  const { data, isLoading } = usePaymentStats();

  const stats = [
    {
      label: "Total payments",
      value: data?.totalPayments ?? 0,
      description: "Recorded transactions",
      icon: Banknote,
      format: "number",
    },
    {
      label: "Completed amount",
      value: data?.completedAmount ?? 0,
      description: `${data?.completedCount ?? 0} successful payments`,
      icon: CheckCircle2,
      format: "money",
    },
    {
      label: "Pending amount",
      value: data?.pendingAmount ?? 0,
      description: `${data?.pendingCount ?? 0} awaiting payment`,
      icon: Clock3,
      format: "money",
    },
    {
      label: "Failed payments",
      value: data?.failedCount ?? 0,
      description: "Unsuccessful transactions",
      icon: XCircle,
      format: "number",
    },
    {
      label: "Refunded amount",
      value: data?.refundedAmount ?? 0,
      description: `${data?.refundedCount ?? 0} refunded transactions`,
      icon: RotateCcw,
      format: "money",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading
                  ? "..."
                  : stat.format === "money"
                    ? formatPaymentAmount(Number(stat.value))
                    : stat.value.toLocaleString()}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
