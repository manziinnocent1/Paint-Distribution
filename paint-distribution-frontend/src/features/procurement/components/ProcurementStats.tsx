import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet,
  ShoppingCart,
  PackageCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProcurementStats } from "../hooks/useProcurement";
import { formatProcurementCurrency } from "../utils/procurement.utils";

export function ProcurementStats() {
  const { data, isLoading } = useProcurementStats();

  const stats = [
    {
      label: "Total requests",
      value: data?.totalRequests ?? 0,
      icon: ClipboardList,
    },
    {
      label: "Pending approval",
      value: data?.pendingRequests ?? 0,
      icon: Clock,
    },
    {
      label: "Approved",
      value: data?.approvedRequests ?? 0,
      icon: CheckCircle2,
    },
    {
      label: "Rejected",
      value: data?.rejectedRequests ?? 0,
      icon: XCircle,
    },
    {
      label: "Estimated value",
      value: formatProcurementCurrency(data?.totalEstimatedValue ?? 0),
      icon: Wallet,
    },
    {
      label: "Active orders",
      value: data?.activePurchaseOrders ?? 0,
      icon: ShoppingCart,
    },
    {
      label: "Received orders",
      value: data?.receivedOrders ?? 0,
      icon: PackageCheck,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
