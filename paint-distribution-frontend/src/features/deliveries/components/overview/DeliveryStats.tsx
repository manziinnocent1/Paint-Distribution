import {
  CheckCircle2,
  Clock3,
  Package,
  Truck,
  XCircle,
  Wallet,
} from "lucide-react";

import { DeliveryStatCard } from "../cards/DeliveryStatCard";
import type { DeliveryStats as DeliveryStatsType } from "../../types/delivery.types";
import { formatDeliveryCurrency } from "../../utils/delivery-formatters";

interface DeliveryStatsProps {
  stats: DeliveryStatsType;
}

export function DeliveryStats({ stats }: DeliveryStatsProps) {
  return (
    <section aria-label="Delivery statistics">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DeliveryStatCard
          title="Total deliveries"
          value={stats.totalDeliveries}
          description="All recorded deliveries"
          icon={Package}
          color="blue"
        />
        <DeliveryStatCard
          title="Awaiting dispatch"
          value={stats.pendingDeliveries}
          description="Pending, preparing, or ready"
          icon={Clock3}
          color="amber"
        />
        <DeliveryStatCard
          title="In progress"
          value={stats.inProgressDeliveries}
          description="Assigned or in transit"
          icon={Truck}
          color="purple"
        />
        <DeliveryStatCard
          title="Delivered"
          value={stats.deliveredDeliveries}
          description="Successfully completed"
          icon={CheckCircle2}
          color="green"
        />
        <DeliveryStatCard
          title="Failed deliveries"
          value={stats.failedDeliveries + stats.cancelledDeliveries}
          description={`${stats.failedDeliveries} failed · ${stats.cancelledDeliveries} cancelled`}
          icon={XCircle}
          color="red"
        />
        <DeliveryStatCard
          title="Delivery fees"
          value={formatDeliveryCurrency(stats.totalDeliveryFees)}
          description="Total fees across recorded deliveries"
          icon={Wallet}
          color="blue"
        />
      </div>
    </section>
  );
}
