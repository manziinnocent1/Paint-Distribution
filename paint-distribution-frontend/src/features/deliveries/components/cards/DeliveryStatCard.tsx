import type { LucideIcon } from "lucide-react";

interface DeliveryStatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  color?: "blue" | "green" | "amber" | "red" | "purple";
}

const colors = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  purple: "bg-purple-50 text-purple-600",
};

export function DeliveryStatCard({
  title,
  value,
  description,
  icon: Icon,
  color = "blue",
}: DeliveryStatCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <span className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={21} />
        </span>
      </div>
      <p className="mt-3 text-xs text-slate-500">{description}</p>
    </article>
  );
}
