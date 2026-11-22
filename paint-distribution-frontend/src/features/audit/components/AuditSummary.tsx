import {
  Activity,
  CalendarDays,
  PlusCircle,
  Pencil,
  Trash2,
  LogIn,
} from "lucide-react";

import type { AuditSummary as AuditSummaryType } from "../types/audit.types";

interface AuditSummaryProps {
  summary: AuditSummaryType;
  loading?: boolean;
}

export default function AuditSummary({
  summary,
  loading = false,
}: AuditSummaryProps) {
  const cards = [
    {
      label: "Total events",
      value: summary.total_events,
      icon: <Activity size={20} />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Today's events",
      value: summary.today_events,
      icon: <CalendarDays size={20} />,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Create actions",
      value: summary.create_events,
      icon: <PlusCircle size={20} />,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Update actions",
      value: summary.update_events,
      icon: <Pencil size={20} />,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Delete actions",
      value: summary.delete_events,
      icon: <Trash2 size={20} />,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Login events",
      value: summary.login_events,
      icon: <LogIn size={20} />,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="h-28 animate-pulse rounded-xl border border-gray-200 bg-gray-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{card.label}</p>

            <div className={`rounded-lg p-2 ${card.color}`}>{card.icon}</div>
          </div>

          <p className="mt-3 text-2xl font-bold text-gray-900">
            {new Intl.NumberFormat("en-US").format(card.value)}
          </p>
        </div>
      ))}
    </div>
  );
}
