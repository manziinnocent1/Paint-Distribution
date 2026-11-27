import { Badge } from "../../components/ui/badge";

import type { CustomerType } from "../../types/customer.types";
import { CUSTOMER_TYPE_STYLES } from "../../constants/customer.constants";

interface CustomerTypeBadgeProps {
  type: CustomerType;
}

export function CustomerTypeBadge({ type }: CustomerTypeBadgeProps) {
  return (
    <Badge variant="outline" className={CUSTOMER_TYPE_STYLES[type]}>
      {type === "BUSINESS" ? "Business" : "Individual"}
    </Badge>
  );
}
