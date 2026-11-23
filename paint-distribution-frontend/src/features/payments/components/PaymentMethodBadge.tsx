import { Badge } from "@/components/ui/badge";
import { getPaymentMethodLabel } from "../utils/payment.utils";
import type { PaymentMethod } from "../types/payment.types";

export function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  return <Badge variant="outline">{getPaymentMethodLabel(method)}</Badge>;
}
