
import type {
  CustomerStatus,
  CustomerType,
} from "../types/customer.types";

export const CUSTOMER_STATUSES: {
  value: CustomerStatus;
  label: string;
}[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
];

export const CUSTOMER_TYPES: {
  value: CustomerType;
  label: string;
}[] = [
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "BUSINESS", label: "Business" },
];

export const CUSTOMER_ADDRESS_TYPES = [
  { value: "BILLING", label: "Billing address" },
  { value: "SHIPPING", label: "Shipping address" },
  { value: "BOTH", label: "Billing and shipping" },
] as const;

export const CUSTOMER_DEFAULT_FILTERS = {
  search: "",
  customer_type: "",
  status: "",
  city: "",
  ordering: "-created_at",
  page: 1,
  page_size: 10,
};

export const CUSTOMER_PAGE_SIZE_OPTIONS = [
  { label: "10 per page", value: 10 },
  { label: "25 per page", value: 25 },
  { label: "50 per page", value: 50 },
  { label: "100 per page", value: 100 },
];

export const CUSTOMER_SORT_OPTIONS = [
  { label: "Newest first", value: "-created_at" },
  { label: "Oldest first", value: "created_at" },
  { label: "Name A–Z", value: "first_name" },
  { label: "Name Z–A", value: "-first_name" },
  { label: "Customer number", value: "customer_number" },
];

export const CUSTOMER_STATUS_STYLES: Record<CustomerStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  INACTIVE: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  SUSPENDED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export const CUSTOMER_TYPE_STYLES: Record<CustomerType, string> = {
  INDIVIDUAL: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  BUSINESS: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export const CUSTOMER_CURRENCIES = [
  { label: "Rwandan Franc (RWF)", value: "RWF" },
  { label: "US Dollar (USD)", value: "USD" },
];
