import { Link } from "react-router-dom";
import { ClipboardList, Package, ShoppingCart, Users } from "lucide-react";
import type { DashboardQuickAction } from "../../types/dashboard.types";

interface QuickActionsProps {
  actions: DashboardQuickAction[];
}

const icons = {
  "shopping-cart": ShoppingCart,
  package: Package,
  users: Users,
  "clipboard-list": ClipboardList,
};

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {actions.map((action) => {
        const Icon = icons[action.icon as keyof typeof icons] ?? ClipboardList;

        return (
          <Link
            key={action.id}
            to={action.href}
            className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
          >
            <span className="rounded-lg bg-blue-50 p-2.5 text-blue-600 transition group-hover:bg-blue-100">
              <Icon size={19} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-slate-800">
                {action.title}
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                {action.description}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
