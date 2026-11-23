import { AlertTriangle, PackageX } from "lucide-react";
import { Link } from "react-router-dom";
import type { InventoryAlert } from "../../types/dashboard.types";

interface InventoryAlertsProps {
  alerts: InventoryAlert[];
}

export function InventoryAlerts({ alerts }: InventoryAlertsProps) {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => {
        const isOutOfStock = alert.alertLevel === "out_of_stock";

        return (
          <div key={alert.id} className="flex items-start gap-3">
            <div
              className={`rounded-lg p-2 ${isOutOfStock ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}
            >
              {isOutOfStock ? (
                <PackageX size={18} />
              ) : (
                <AlertTriangle size={18} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">
                {alert.productName}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {alert.productCode} · {alert.warehouseName ?? "Warehouse"}
              </p>
              <p
                className={`mt-1 text-xs font-medium ${isOutOfStock ? "text-red-600" : "text-amber-600"}`}
              >
                {isOutOfStock
                  ? "Out of stock"
                  : `${alert.currentStock} ${alert.unit ?? "units"} remaining · Minimum ${alert.minimumStock}`}
              </p>
            </div>
          </div>
        );
      })}

      {alerts.length === 0 && (
        <p className="py-6 text-center text-sm text-slate-500">
          No inventory alerts. Stock levels look good.
        </p>
      )}

      <Link
        to="/inventory"
        className="inline-flex text-sm font-semibold text-blue-600 hover:underline"
      >
        View inventory
      </Link>
    </div>
  );
}
