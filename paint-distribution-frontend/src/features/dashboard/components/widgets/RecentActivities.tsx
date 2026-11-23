import {
  Activity,
  Package,
  ShoppingCart,
  UserPlus,
  Wallet,
} from "lucide-react";
import type { DashboardActivity } from "../../types/dashboard.types";
import { formatRelativeTime } from "../../utils/dashboard-formatters";

interface RecentActivitiesProps {
  activities: DashboardActivity[];
}

function getActivityIcon(type: DashboardActivity["type"]) {
  if (type.includes("sale") || type.includes("order")) return ShoppingCart;
  if (type.includes("payment")) return Wallet;
  if (type.includes("product") || type.includes("stock")) return Package;
  if (type.includes("customer")) return UserPlus;
  return Activity;
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <div className="space-y-5">
      {activities.map((activity) => {
        const Icon = getActivityIcon(activity.type);

        return (
          <div key={activity.id} className="flex gap-3">
            <div className="rounded-full bg-slate-100 p-2 text-slate-600">
              <Icon size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-800">
                  {activity.title}
                </p>
                <span className="shrink-0 text-xs text-slate-400">
                  {formatRelativeTime(activity.timestamp)}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {activity.description}
              </p>
              {activity.userName && (
                <p className="mt-1 text-xs text-slate-400">
                  By {activity.userName}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {activities.length === 0 && (
        <p className="py-6 text-center text-sm text-slate-500">
          No recent activities.
        </p>
      )}
    </div>
  );
}
