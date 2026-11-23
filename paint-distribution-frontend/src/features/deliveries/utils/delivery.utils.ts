
import type {
  Delivery,
  DeliveryDateRange,
  DeliveryFilters,
  DeliveryStatus,
} from "../types/delivery.types";
import { DELIVERY_STATUS_TRANSITIONS } from "../constants/delivery.constants";

export function canTransitionDeliveryStatus(
  current: DeliveryStatus,
  next: DeliveryStatus,
): boolean {
  return DELIVERY_STATUS_TRANSITIONS[current].includes(next);
}

export function getNextDeliveryStatuses(
  current: DeliveryStatus,
): DeliveryStatus[] {
  return DELIVERY_STATUS_TRANSITIONS[current];
}

export function filterDeliveries(
  deliveries: Delivery[],
  filters: DeliveryFilters,
): Delivery[] {
  const query = filters.search.trim().toLowerCase();

  return deliveries.filter((delivery) => {
    const matchesSearch =
      !query ||
      delivery.deliveryNumber.toLowerCase().includes(query) ||
      delivery.trackingNumber.toLowerCase().includes(query) ||
      delivery.orderReference.toLowerCase().includes(query) ||
      delivery.customer.name.toLowerCase().includes(query) ||
      delivery.customer.phoneNumber.toLowerCase().includes(query);

    const matchesStatus =
      filters.status === "ALL" || delivery.status === filters.status;

    const createdAt = new Date(delivery.createdAt);
    const now = new Date();

    let matchesDate = true;

    if (filters.dateRange === "today") {
      matchesDate = createdAt.toDateString() === now.toDateString();
    } else if (filters.dateRange === "last_7_days") {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      matchesDate = createdAt >= start;
    } else if (filters.dateRange === "last_30_days") {
      const start = new Date(now);
      start.setDate(now.getDate() - 30);
      matchesDate = createdAt >= start;
    } else if (filters.dateRange === "this_month") {
      matchesDate =
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear();
    }

    return matchesSearch && matchesStatus && matchesDate;
  });
}

export function sortDeliveries(
  deliveries: Delivery[],
  ordering: string,
): Delivery[] {
  const sorted = [...deliveries];
  const descending = ordering.startsWith("-");
  const field = descending ? ordering.slice(1) : ordering;

  sorted.sort((a, b) => {
    let first = "";
    let second = "";

    if (field === "deliveryNumber") {
      first = a.deliveryNumber;
      second = b.deliveryNumber;
    } else if (field === "status") {
      first = a.status;
      second = b.status;
    } else {
      first = a.createdAt;
      second = b.createdAt;
    }

    const result = first.localeCompare(second);
    return descending ? -result : result;
  });

  return sorted;
}

export function paginateDeliveries(
  deliveries: Delivery[],
  page: number,
  pageSize: number,
) {
  const count = deliveries.length;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    count,
    page: safePage,
    pageSize,
    totalPages,
    results: deliveries.slice(start, start + pageSize),
  };
}

export function isDeliveryDateRange(value: string): value is DeliveryDateRange {
  return [
    "today",
    "last_7_days",
    "last_30_days",
    "this_month",
    "all",
  ].includes(value);
}
