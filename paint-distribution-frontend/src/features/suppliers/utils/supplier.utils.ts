import type {
  Supplier,
  SupplierStatus,
  SupplierType,
} from "../types/supplier.types";

export function formatSupplierCurrency(
  amount: number,
  currency = "RWF",
): string {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatSupplierDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function getSupplierStatusLabel(status: SupplierStatus): string {
  const labels: Record<SupplierStatus, string> = {
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    suspended: "Suspended",
  };

  return labels[status];
}

export function getSupplierTypeLabel(type: SupplierType): string {
  const labels: Record<SupplierType, string> = {
    manufacturer: "Manufacturer",
    distributor: "Distributor",
    wholesaler: "Wholesaler",
    retailer: "Retailer",
    other: "Other",
  };

  return labels[type];
}

export function getPrimarySupplierAddress(supplier: Supplier) {
  return (
    supplier.addresses.find((address) => address.isPrimary) ??
    supplier.addresses[0]
  );
}

export function getPrimarySupplierContact(supplier: Supplier) {
  return (
    supplier.contacts.find((contact) => contact.isPrimary) ??
    supplier.contacts[0]
  );
}

export function canEditSupplier(supplier: Supplier): boolean {
  return supplier.status !== "suspended";
}

export function canDeleteSupplier(supplier: Supplier): boolean {
  return (
    supplier.paymentSummary.outstandingBalance === 0 &&
    supplier.products.length === 0
  );
}

export function getSupplierInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getSupplierFullAddress(supplier: Supplier): string {
  const address = getPrimarySupplierAddress(supplier);

  if (!address) return "No address provided";

  return [
    address.street,
    address.city,
    address.province,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}