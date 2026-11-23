import { Banknote, CheckCircle2, Clock3, FileText, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalesStats } from "../hooks/useSalesStats";
import { formatSaleCurrency } from "../utils/sales.utils";

export function SalesStats() {
  const { data, isLoading, isError } = useSalesStats();

  const stats = [
    {
      title: "Total sales",
      value: data?.totalSales ?? 0,
      icon: FileText,
      description: "All recorded sales",
    },
    {
      title: "Completed revenue",
      value: formatSaleCurrency(data?.totalRevenue ?? 0),
      icon: Banknote,
      description: "Revenue from completed sales",
    },
    {
      title: "Pending sales",
      value: data?.pendingSales ?? 0,
      icon: Clock3,
      description: "Awaiting completion",
    },
    {
      title: "Completed sales",
      value: data?.completedSales ?? 0,
      icon: CheckCircle2,
      description: "Successfully completed",
    },
    {
      title: "Outstanding balance",
      value: formatSaleCurrency(data?.outstandingBalance ?? 0),
      icon: Wallet,
      description: "Amount yet to be collected",
    },
  ];

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Sales statistics could not be loaded.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "—" : stat.value}
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
