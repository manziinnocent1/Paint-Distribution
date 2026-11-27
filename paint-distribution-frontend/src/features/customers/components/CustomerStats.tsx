import { Users, UserRound, Building2, UserCheck, UserX } from "lucide-react";

import type { Customer } from "../types/customer.types";

import { Card, CardContent } from "../components/ui/card";

interface CustomerStatsProps {
  customers: Customer[];
  total: number;
}

export function CustomerStats({ customers, total }: CustomerStatsProps) {
  const active = customers.filter(
    (customer) => customer.status === "ACTIVE",
  ).length;

  const individual = customers.filter(
    (customer) => customer.customer_type === "INDIVIDUAL",
  ).length;

  const business = customers.filter(
    (customer) => customer.customer_type === "BUSINESS",
  ).length;

  const suspended = customers.filter(
    (customer) => customer.status === "SUSPENDED",
  ).length;

  const stats = [
    {
      label: "Total customers",
      value: total,
      icon: Users,
      color: "text-primary",
      background: "bg-primary/10",
    },
    {
      label: "Active customers on page",
      value: active,
      icon: UserCheck,
      color: "text-green-600",
      background: "bg-green-500/10",
    },
    {
      label: "Individual customers on page",
      value: individual,
      icon: UserRound,
      color: "text-blue-600",
      background: "bg-blue-500/10",
    },
    {
      label: "Business customers on page",
      value: business,
      icon: Building2,
      color: "text-purple-600",
      background: "bg-purple-500/10",
    },
    {
      label: "Suspended on page",
      value: suspended,
      icon: UserX,
      color: "text-red-600",
      background: "bg-red-500/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-5">
              <div className={`rounded-lg p-3 ${stat.background}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
