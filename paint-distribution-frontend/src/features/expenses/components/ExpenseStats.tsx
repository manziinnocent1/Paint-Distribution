import { Banknote, CheckCircle2, Clock, Receipt, Wallet } from "lucide-react";
import type { ExpenseStats as ExpenseStatsType } from "../types/expense.types";
import { formatExpenseCurrency } from "../utils/expense.utils";

interface ExpenseStatsProps {
  stats: ExpenseStatsType;
}

export function ExpenseStats({ stats }: ExpenseStatsProps) {
  const cards = [
    {
      label: "Total expenses",
      value: formatExpenseCurrency(stats.totalAmount),
      detail: `${stats.totalExpenses} expense records`,
      icon: Receipt,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Paid amount",
      value: formatExpenseCurrency(stats.paidAmount),
      detail: `${stats.paidCount} fully paid`,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Outstanding",
      value: formatExpenseCurrency(stats.outstandingAmount),
      detail: "Remaining balance",
      icon: Wallet,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Pending approval",
      value: stats.pendingCount.toLocaleString("en-RW"),
      detail: "Awaiting review",
      icon: Clock,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <span className={`rounded-lg p-2 ${card.color}`}>
                <Icon size={19} />
              </span>
            </div>

            <p className="mt-4 text-2xl font-bold text-slate-900">
              {card.value}
            </p>
            <p className="mt-2 text-xs text-slate-500">{card.detail}</p>
          </article>
        );
      })}
    </div>
  );
}
