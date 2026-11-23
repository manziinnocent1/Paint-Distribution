import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategorySalesData } from "../../types/dashboard.types";
import { formatCurrency } from "../../utils/dashboard-formatters";

interface SalesByCategoryChartProps {
  data: CategorySalesData[];
}

export function SalesByCategoryChart({ data }: SalesByCategoryChartProps) {
  return (
    <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="totalRevenue"
              nameKey="categoryName"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
            >
              {data.map((item) => (
                <Cell key={item.categoryId} fill={item.color ?? "#2563EB"} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.categoryId}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: item.color ?? "#2563EB" }}
              />
              <span className="truncate text-sm text-slate-600">
                {item.categoryName}
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-800">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
