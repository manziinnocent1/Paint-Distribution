import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { PaymentMethodData } from "../../types/dashboard.types";
import { formatCurrency } from "../../utils/dashboard-formatters";

interface PaymentMethodsChartProps {
  data: PaymentMethodData[];
}

export function PaymentMethodsChart({ data }: PaymentMethodsChartProps) {
  return (
    <div className="space-y-4">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="totalAmount"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
            >
              {data.map((item) => (
                <Cell key={item.method} fill={item.color ?? "#2563EB"} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.method}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color ?? "#2563EB" }}
              />
              <span className="text-sm text-slate-600">{item.label}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">
                {formatCurrency(item.totalAmount)}
              </p>
              <p className="text-xs text-slate-500">
                {item.percentage}% · {item.transactionCount} transactions
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
