import { DELIVERY_DATE_RANGES } from "../../constants/delivery.constants";
import type { DeliveryDateRange } from "../../types/delivery.types";

interface DeliveryDateFilterProps {
  value: DeliveryDateRange;
  onChange: (value: DeliveryDateRange) => void;
}

export function DeliveryDateFilter({
  value,
  onChange,
}: DeliveryDateFilterProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      <span>Date:</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as DeliveryDateRange)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
      >
        {DELIVERY_DATE_RANGES.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
    </label>
  );
}
