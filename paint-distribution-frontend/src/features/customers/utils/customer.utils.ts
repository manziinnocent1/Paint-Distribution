
import type {
  Customer,
  CustomerAddress,
  CustomerStatus,
} from "../types/customer.types";

export function getCustomerFullName(customer: Customer): string {
  if (customer.customer_type === "BUSINESS") {
    return customer.business_name || "Unnamed business";
  }

  return `${customer.first_name} ${customer.last_name}`.trim();
}

export function getCustomerInitials(customer: Customer): string {
  const name = getCustomerFullName(customer);

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function formatCustomerStatus(status: CustomerStatus): string {
  const labels: Record<CustomerStatus, string> = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    SUSPENDED: "Suspended",
  };

  return labels[status];
}

export function formatCustomerDate(
  date?: string | null,
): string {
  if (!date) return "Not available";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export function formatCustomerCurrency(
  amount?: number | string | null,
  currency = "RWF",
): string {
  const value = Number(amount ?? 0);

  if (!Number.isFinite(value)) return "—";

  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCustomerAddress(
  address: CustomerAddress,
): string {
  return [
    address.address_line_1,
    address.address_line_2,
    address.city,
    address.district,
    address.province,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export function filterCustomersLocally(
  customers: Customer[],
  search: string,
): Customer[] {
  const query = search.trim().toLowerCase();

  if (!query) return customers;

  return customers.filter((customer) => {
    const searchable = [
      customer.customer_number,
      customer.first_name,
      customer.last_name,
      customer.business_name,
      customer.email,
      customer.phone_number,
    ];

    return searchable.some((value) =>
      value?.toLowerCase().includes(query),
    );
  });
}

export function calculateCustomerStats(
  customers: Customer[],
) {
  return {
    total_customers: customers.length,

    active_customers: customers.filter(
      (customer) => customer.status === "ACTIVE",
    ).length,

    inactive_customers: customers.filter(
      (customer) => customer.status === "INACTIVE",
    ).length,

    suspended_customers: customers.filter(
      (customer) => customer.status === "SUSPENDED",
    ).length,

    individual_customers: customers.filter(
      (customer) => customer.customer_type === "INDIVIDUAL",
    ).length,

    business_customers: customers.filter(
      (customer) => customer.customer_type === "BUSINESS",
    ).length,
  };
}
