import { Building2, UserRound } from "lucide-react";

import type { Customer } from "../../types/customer.types";
import { getCustomerInitials } from "../../utils/customer.utils";

interface CustomerAvatarProps {
  customer: Customer;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-lg",
};

export function CustomerAvatar({ customer, size = "md" }: CustomerAvatarProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary ${sizes[size]}`}
      aria-label={
        customer.business_name || `${customer.first_name} ${customer.last_name}`
      }
    >
      {customer.customer_type === "BUSINESS" ? (
        <Building2 className="h-1/2 w-1/2" />
      ) : (
        getCustomerInitials(customer) || <UserRound className="h-1/2 w-1/2" />
      )}
    </div>
  );
}
