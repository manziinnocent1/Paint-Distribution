import { Link } from "react-router-dom";

import type { RecentSale } from "../types/analytics.types";

import { formatCurrency, formatDate } from "../utils/analytics.utils";

interface RecentSalesProps {
  sales: RecentSale[];
  loading?: boolean;
}

const statusStyles: Record<string, string> = {
  completed: "bg-green-50 text-green-700",
  paid: "bg-green-50 text-green-700",
  pending: "bg-yellow-50 text-yellow-700",
  cancelled: "bg-red-50 text-red-700",
  processing: "bg-blue-50 text-blue-700",
  draft: "bg-gray-100 text-gray-600",
};

export default function RecentSales({
  sales,
  loading = false,
}: RecentSalesProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Recent sales
          </h3>

          <p className="mt-1 text-sm text-gray-500">Latest transactions</p>
        </div>

        <Link
          to="/sales"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3 p-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded bg-gray-100"
            />
          ))}
        </div>
      ) : sales.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-500">
          No recent sales available.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Sale</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                    {sale.sale_number}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                    {sale.customer_name}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                    {formatCurrency(sale.total_amount)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusStyles[sale.status.toLowerCase()] ??
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {sale.status.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                    {formatDate(sale.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
