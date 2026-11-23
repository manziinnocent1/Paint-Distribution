import {
  Building2,
  CheckCircle2,
  Clock,
  Package,
  Wallet,
  XCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useSupplierStats } from "../hooks/useSuppliers";
import { formatSupplierCurrency } from "../utils/supplier.utils";

export function SupplierStats() {
  const { data, isLoading } = useSupplierStats();

  const stats = [
    {
      label: "Total suppliers",
      value: data?.totalSuppliers ?? 0,
      icon: Building2,
    },
    {
      label: "Active suppliers",
      value: data?.activeSuppliers ?? 0,
      icon: CheckCircle2,
    },
    {
      label: "Pending suppliers",
      value: data?.pendingSuppliers ?? 0,
      icon: Clock,
    },
    {
      label: "Inactive suppliers",
      value: data?.inactiveSuppliers ?? 0,
      icon: XCircle,
    },
    {
      label: "Supplier products",
      value: data?.totalProducts ?? 0,
      icon: Package,
    },
    {
      label: "Outstanding balance",
      value: formatSupplierCurrency(
        data?.totalOutstandingBalance ?? 0,
        data?.currency ?? "RWF",
      ),
      icon: Wallet,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : stat.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
