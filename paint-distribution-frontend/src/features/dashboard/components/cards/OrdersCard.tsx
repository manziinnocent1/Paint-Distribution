import { ClipboardList } from "lucide-react";

interface OrdersCardProps {
  totalOrders: number;
  pendingOrders: number;
}

export function OrdersCard({ totalOrders, pendingOrders }: OrdersCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-purple-50 p-2 text-purple-600">
          <ClipboardList size={20} />
        </span>
        <span className="text-sm font-medium text-slate-600">Orders</span>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900">
        {totalOrders.toLocaleString("en-RW")}
      </p>

      <p className="mt-3 text-sm text-slate-500">
        <span className="font-semibold text-orange-600">{pendingOrders}</span>{" "}
        pending orders
      </p>
    </div>
  );
}
