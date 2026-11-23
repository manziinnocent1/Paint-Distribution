import {
  Bell,
  BellRing,
  CheckCheck,
  Archive,
  AlertTriangle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { NotificationStats as Stats } from "../types/notification.types";

interface Props {
  stats?: Stats;
  isLoading?: boolean;
}

export function NotificationStats({ stats, isLoading }: Props) {
  const items = [
    {
      title: "Total notifications",
      value: stats?.total ?? 0,
      icon: Bell,
      description: "Active notifications",
    },
    {
      title: "Unread",
      value: stats?.unread ?? 0,
      icon: BellRing,
      description: "Awaiting your attention",
    },
    {
      title: "Read",
      value: stats?.read ?? 0,
      icon: CheckCheck,
      description: "Already reviewed",
    },
    {
      title: "Archived",
      value: stats?.archived ?? 0,
      icon: Archive,
      description: "Stored notifications",
    },
    {
      title: "Urgent",
      value: stats?.urgent ?? 0,
      icon: AlertTriangle,
      description: "High-priority alerts",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title}>
            <CardContent className="flex items-start justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{item.title}</p>

                <p className="mt-2 text-2xl font-bold">
                  {isLoading ? "..." : item.value}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
