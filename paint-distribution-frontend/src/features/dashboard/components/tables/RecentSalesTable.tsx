import { Link } from "react-router-dom";
import type { DashboardSale } from "../../types/dashboard.types";
import {
  formatCurrency,
  formatDateTime,
} from "../../utils/dashboard-formatters";

interface RecentSalesTableProps {
  sales: DashboardSale[];
}

const statusStyles: Record<DashboardSale["status"], string> = {
  completed: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-700",
  refunded: "bg-purple-50 text-purple-700",
  partially_paid: "bg-blue-50 text-blue-700",
};

const statusLabels: Record<DashboardSale["status"], string> = {
  completed: "Completed",
  pending: "Pending",
  cancelled: "Cancelled",
  refunded: "Refunded",
  partially_paid: "Partially paid",
};

export function RecentSalesTable({ sales }: RecentSalesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3 font-medium">Sale</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr
              key={sale.id}
              className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
            >
              <td className="px-4 py-4">
                <Link
                  to={`/sales/${sale.id}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {sale.saleNumber}
                </Link>
              </td>
              <td className="px-4 py-4 font-medium text-slate-800">
                {sale.customerName}
              </td>
              <td className="px-4 py-4 text-slate-500">
                {formatDateTime(sale.saleDate)}
              </td>
              <td className="px-4 py-4 font-semibold text-slate-800">
                {formatCurrency(sale.totalAmount)}
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[sale.status]}`}
                >
                  {statusLabels[sale.status]}
                </span>
              </td>
            </tr>
          ))}
          {sales.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                No sales available for this period.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
