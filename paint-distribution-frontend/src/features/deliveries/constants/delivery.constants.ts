
import type {
  DeliveryDateRange,
  DeliveryStatus,
  DeliveryStatusOption,
  DeliveryVehicleOption,
} from "../types/delivery.types";

export const DELIVERY_STATUSES: DeliveryStatusOption[] = [
  { value: "PENDING", label: "Pending" },
  { value: "PREPARING", label: "Preparing" },
  { value: "READY", label: "Ready for dispatch" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_TRANSIT", label: "In transit" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "RETURNED", label: "Returned" },
];

export const DELIVERY_VEHICLES: DeliveryVehicleOption[] = [
  { value: "MOTORCYCLE", label: "Motorcycle" },
  { value: "BICYCLE", label: "Bicycle" },
  { value: "CAR", label: "Car" },
  { value: "VAN", label: "Van" },
];

export const DELIVERY_DATE_RANGES: {
  label: string;
  value: DeliveryDateRange;
}[] = [
  { label: "All time", value: "all" },
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "last_7_days" },
  { label: "Last 30 days", value: "last_30_days" },
  { label: "This month", value: "this_month" },
];

export const DEFAULT_DELIVERY_FILTERS = {
  search: "",
  status: "ALL" as const,
  dateRange: "all" as DeliveryDateRange,
  page: 1,
  pageSize: 10,
  ordering: "-createdAt",
};

export const DELIVERY_QUERY_KEYS = {
  all: ["deliveries"] as const,
  lists: () => ["deliveries", "list"] as const,
  list: (filters: object) => ["deliveries", "list", filters] as const,
  details: () => ["deliveries", "detail"] as const,
  detail: (id: string) => ["deliveries", "detail", id] as const,
  stats: () => ["deliveries", "stats"] as const,
  history: (id: string) => ["deliveries", "history", id] as const,
};

export const DELIVERY_STATUS_COLORS: Record<DeliveryStatus, string> = {
  PENDING: "bg-slate-100 text-slate-700",
  PREPARING: "bg-blue-100 text-blue-700",
  READY: "bg-cyan-100 text-cyan-700",
  ASSIGNED: "bg-indigo-100 text-indigo-700",
  IN_TRANSIT: "bg-amber-100 text-amber-700",
  DELIVERED: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-600",
  RETURNED: "bg-purple-100 text-purple-700",
};

export const DELIVERY_STATUS_TRANSITIONS: Record<
  DeliveryStatus,
  DeliveryStatus[]
> = {
  PENDING: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["ASSIGNED", "CANCELLED"],
  ASSIGNED: ["IN_TRANSIT", "CANCELLED"],
  IN_TRANSIT: ["DELIVERED", "FAILED", "RETURNED"],
  DELIVERED: [],
  FAILED: ["RETURNED"],
  CANCELLED: [],
  RETURNED: [],
};

export const DELIVERY_ROUTES = {
  list: "/deliveries",
  create: "/deliveries/new",
  detail: (id: string) => `/deliveries/${id}`,
  edit: (id: string) => `/deliveries/${id}/edit`,
};
