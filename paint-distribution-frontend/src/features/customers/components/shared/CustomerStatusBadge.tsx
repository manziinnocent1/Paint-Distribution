import { Badge } from "../../components/ui/badge";

import type { CustomerStatus } from "../../types/customer.types";
import { CUSTOMER_STATUS_STYLES } from "../../constants/customer.constants";
import { formatCustomerStatus } from "../../utils/customer.utils";

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
}

export function CustomerStatusBadge({ status }: CustomerStatusBadgeProps) {
  return (
    <Badge variant="outline" className={CUSTOMER_STATUS_STYLES[status]}>
      {formatCustomerStatus(status)}
    </Badge>
  );
}
