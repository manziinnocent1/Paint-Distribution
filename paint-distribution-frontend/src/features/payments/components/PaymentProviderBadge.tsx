import { Badge } from "@/components/ui/badge";
import { getPaymentProviderLabel } from "../utils/payment.utils";
import type { PaymentProvider } from "../types/payment.types";

export function PaymentProviderBadge({
  provider,
}: {
  provider: PaymentProvider;
}) {
  return <Badge variant="secondary">{getPaymentProviderLabel(provider)}</Badge>;
}
