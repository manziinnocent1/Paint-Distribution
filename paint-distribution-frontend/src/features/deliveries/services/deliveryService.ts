
import type {
  Delivery,
  DeliveryFilters,
  DeliveryFormValues,
  DeliveryStats,
  DeliveryStatus,
  DeliveryStatusFormValues,
  DeliveryStatusHistory,
  PaginatedDeliveries,
} from "../types/delivery.types";

import {
  canTransitionDeliveryStatus,
  filterDeliveries,
  paginateDeliveries,
  sortDeliveries,
} from "../utils/delivery.utils";

const now = new Date();

function dateDaysAgo(days: number): string {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

const initialDeliveries: Delivery[] = [
  {
    id: "delivery-001",
    deliveryNumber: "DEL-2026-001",
    trackingNumber: "TRK-001-RW",
    orderReference: "ORD-2026-001",
    customer: {
      id: "customer-001",
      name: "Kigali Construction Ltd",
      phoneNumber: "+250788100001",
      email: "orders@kigaliconstruction.rw",
    },
    address: {
      addressLine1: "KG 123 Street",
      city: "Kigali",
      district: "Gasabo",
      country: "Rwanda",
      landmark: "Near the main road",
    },
    status: "DELIVERED",
    driver: {
      id: "driver-001",
      name: "Jean Claude",
      phoneNumber: "+250788100010",
      vehicleType: "MOTORCYCLE",
      vehicleRegistration: "RAA 123 A",
    },
    vehicleType: "MOTORCYCLE",
    vehicleRegistration: "RAA 123 A",
    deliveryFee: 5000,
    estimatedDeliveryAt: dateDaysAgo(2),
    dispatchedAt: dateDaysAgo(3),
    deliveredAt: dateDaysAgo(2),
    recipientName: "Eric M.",
    recipientPhone: "+250788100001",
    deliveryNotes: "Deliver to the site manager.",
    createdAt: dateDaysAgo(4),
    updatedAt: dateDaysAgo(2),
    statusHistory: [
      {
        id: "history-001",
        previousStatus: null,
        newStatus: "PENDING",
        note: "Delivery created",
        updatedBy: "Administrator",
        createdAt: dateDaysAgo(4),
      },
      {
        id: "history-002",
        previousStatus: "PENDING",
        newStatus: "PREPARING",
        note: "Order preparation started",
        updatedBy: "Warehouse Manager",
        createdAt: dateDaysAgo(4),
      },
      {
        id: "history-003",
        previousStatus: "PREPARING",
        newStatus: "READY",
        note: "Order ready for dispatch",
        updatedBy: "Warehouse Manager",
        createdAt: dateDaysAgo(3),
      },
      {
        id: "history-004",
        previousStatus: "READY",
        newStatus: "ASSIGNED",
        note: "Driver assigned",
        updatedBy: "Delivery Manager",
        createdAt: dateDaysAgo(3),
      },
      {
        id: "history-005",
        previousStatus: "ASSIGNED",
        newStatus: "IN_TRANSIT",
        note: "Driver dispatched",
        updatedBy: "Delivery Manager",
        createdAt: dateDaysAgo(3),
      },
      {
        id: "history-006",
        previousStatus: "IN_TRANSIT",
        newStatus: "DELIVERED",
        note: "Delivery completed",
        updatedBy: "Jean Claude",
        createdAt: dateDaysAgo(2),
      },
    ],
  },
  {
    id: "delivery-002",
    deliveryNumber: "DEL-2026-002",
    trackingNumber: "TRK-002-RW",
    orderReference: "ORD-2026-002",
    customer: {
      id: "customer-002",
      name: "Bright Homes Ltd",
      phoneNumber: "+250788100002",
    },
    address: {
      addressLine1: "KN 5 Avenue",
      city: "Kigali",
      district: "Nyarugenge",
      country: "Rwanda",
    },
    status: "IN_TRANSIT",
    driver: {
      id: "driver-002",
      name: "Patrick N.",
      phoneNumber: "+250788100020",
      vehicleType: "VAN",
      vehicleRegistration: "RAE 456 B",
    },
    vehicleType: "VAN",
    vehicleRegistration: "RAE 456 B",
    deliveryFee: 12000,
    estimatedDeliveryAt: dateDaysAgo(-1),
    dispatchedAt: dateDaysAgo(0),
    createdAt: dateDaysAgo(1),
    updatedAt: dateDaysAgo(0),
    statusHistory: [
      {
        id: "history-007",
        previousStatus: null,
        newStatus: "PENDING",
        note: "Delivery created",
        createdAt: dateDaysAgo(1),
      },
      {
        id: "history-008",
        previousStatus: "PENDING",
        newStatus: "PREPARING",
        note: "Preparing order",
        createdAt: dateDaysAgo(1),
      },
      {
        id: "history-009",
        previousStatus: "PREPARING",
        newStatus: "READY",
        note: "Ready for dispatch",
        createdAt: dateDaysAgo(0),
      },
      {
        id: "history-010",
        previousStatus: "READY",
        newStatus: "ASSIGNED",
        note: "Driver assigned",
        createdAt: dateDaysAgo(0),
      },
      {
        id: "history-011",
        previousStatus: "ASSIGNED",
        newStatus: "IN_TRANSIT",
        note: "Delivery dispatched",
        createdAt: dateDaysAgo(0),
      },
    ],
  },
  {
    id: "delivery-003",
    deliveryNumber: "DEL-2026-003",
    trackingNumber: "TRK-003-RW",
    orderReference: "ORD-2026-003",
    customer: {
      id: "customer-003",
      name: "Alice M.",
      phoneNumber: "+250788100003",
    },
    address: {
      addressLine1: "KK 15 Road",
      city: "Kigali",
      district: "Kicukiro",
      country: "Rwanda",
    },
    status: "PREPARING",
    deliveryFee: 3500,
    estimatedDeliveryAt: dateDaysAgo(-2),
    createdAt: dateDaysAgo(0),
    updatedAt: dateDaysAgo(0),
    statusHistory: [
      {
        id: "history-012",
        previousStatus: null,
        newStatus: "PENDING",
        note: "Delivery created",
        createdAt: dateDaysAgo(0),
      },
      {
        id: "history-013",
        previousStatus: "PENDING",
        newStatus: "PREPARING",
        note: "Order preparation started",
        createdAt: dateDaysAgo(0),
      },
    ],
  },
  {
    id: "delivery-004",
    deliveryNumber: "DEL-2026-004",
    trackingNumber: "TRK-004-RW",
    orderReference: "ORD-2026-004",
    customer: {
      id: "customer-004",
      name: "Prime Builders",
      phoneNumber: "+250788100004",
    },
    address: {
      addressLine1: "RN 3 Road",
      city: "Musanze",
      district: "Musanze",
      country: "Rwanda",
    },
    status: "PENDING",
    deliveryFee: 18000,
    createdAt: dateDaysAgo(0),
    updatedAt: dateDaysAgo(0),
    statusHistory: [
      {
        id: "history-014",
        previousStatus: null,
        newStatus: "PENDING",
        note: "Delivery created",
        createdAt: dateDaysAgo(0),
      },
    ],
  },
  {
    id: "delivery-005",
    deliveryNumber: "DEL-2026-005",
    trackingNumber: "TRK-005-RW",
    orderReference: "ORD-2026-005",
    customer: {
      id: "customer-005",
      name: "BuildRight Rwanda",
      phoneNumber: "+250788100005",
    },
    address: {
      addressLine1: "Main Street",
      city: "Huye",
      district: "Huye",
      country: "Rwanda",
    },
    status: "FAILED",
    driver: {
      id: "driver-003",
      name: "Emmanuel T.",
      phoneNumber: "+250788100030",
      vehicleType: "CAR",
    },
    vehicleType: "CAR",
    deliveryFee: 15000,
    failureReason: "Recipient was unavailable.",
    createdAt: dateDaysAgo(5),
    updatedAt: dateDaysAgo(3),
    statusHistory: [
      {
        id: "history-015",
        previousStatus: null,
        newStatus: "PENDING",
        createdAt: dateDaysAgo(5),
      },
      {
        id: "history-016",
        previousStatus: "PENDING",
        newStatus: "PREPARING",
        createdAt: dateDaysAgo(4),
      },
      {
        id: "history-017",
        previousStatus: "PREPARING",
        newStatus: "READY",
        createdAt: dateDaysAgo(4),
      },
      {
        id: "history-018",
        previousStatus: "READY",
        newStatus: "ASSIGNED",
        createdAt: dateDaysAgo(4),
      },
      {
        id: "history-019",
        previousStatus: "ASSIGNED",
        newStatus: "IN_TRANSIT",
        createdAt: dateDaysAgo(3),
      },
      {
        id: "history-020",
        previousStatus: "IN_TRANSIT",
        newStatus: "FAILED",
        note: "Recipient was unavailable.",
        createdAt: dateDaysAgo(3),
      },
    ],
  },
];

let deliveries: Delivery[] = [...initialDeliveries];

function generateId(): string {
  return globalThis.crypto?.randomUUID?.() ??
    `delivery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function generateDeliveryNumber(): string {
  return `DEL-${new Date().getFullYear()}-${String(deliveries.length + 1).padStart(3, "0")}`;
}

function generateTrackingNumber(): string {
  return `TRK-${Date.now().toString().slice(-8)}`;
}

function cloneDelivery(delivery: Delivery): Delivery {
  return structuredClone(delivery);
}

export const deliveryService = {
  async getDeliveries(
    filters: DeliveryFilters,
  ): Promise<PaginatedDeliveries> {
    const filtered = filterDeliveries(deliveries, filters);
    const sorted = sortDeliveries(filtered, filters.ordering);

    return paginateDeliveries(
      sorted,
      filters.page,
      filters.pageSize,
    );
  },

  async getDelivery(id: string): Promise<Delivery> {
    const delivery = deliveries.find((item) => item.id === id);

    if (!delivery) {
      throw new Error("Delivery not found.");
    }

    return cloneDelivery(delivery);
  },

  async getDeliveryStats(): Promise<DeliveryStats> {
    return {
      totalDeliveries: deliveries.length,
      pendingDeliveries: deliveries.filter(
        (item) => ["PENDING", "PREPARING", "READY"].includes(item.status),
      ).length,
      inProgressDeliveries: deliveries.filter(
        (item) => ["ASSIGNED", "IN_TRANSIT"].includes(item.status),
      ).length,
      deliveredDeliveries: deliveries.filter(
        (item) => item.status === "DELIVERED",
      ).length,
      failedDeliveries: deliveries.filter(
        (item) => item.status === "FAILED",
      ).length,
      cancelledDeliveries: deliveries.filter(
        (item) => item.status === "CANCELLED",
      ).length,
      totalDeliveryFees: deliveries.reduce(
        (total, item) => total + item.deliveryFee,
        0,
      ),
    };
  },

  async getStatusHistory(id: string): Promise<DeliveryStatusHistory[]> {
    const delivery = await this.getDelivery(id);
    return delivery.statusHistory ?? [];
  },

  async createDelivery(values: DeliveryFormValues): Promise<Delivery> {
    const timestamp = new Date().toISOString();

    const delivery: Delivery = {
      id: generateId(),
      deliveryNumber: generateDeliveryNumber(),
      trackingNumber: generateTrackingNumber(),
      orderReference: values.orderReference,
      customer: {
        id: values.customerId,
        name: `Customer ${values.customerId}`,
        phoneNumber: "",
      },
      address: {
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        district: values.district,
        province: values.province,
        country: values.country,
        postalCode: values.postalCode,
      },
      status: "PENDING",
      deliveryFee: values.deliveryFee,
      estimatedDeliveryAt: values.estimatedDeliveryAt || null,
      deliveryNotes: values.deliveryNotes,
      createdAt: timestamp,
      updatedAt: timestamp,
      statusHistory: [
        {
          id: generateId(),
          previousStatus: null,
          newStatus: "PENDING",
          note: "Delivery created",
          createdAt: timestamp,
        },
      ],
    };

    deliveries = [delivery, ...deliveries];
    return cloneDelivery(delivery);
  },

  async updateDelivery(
    id: string,
    values: DeliveryFormValues,
  ): Promise<Delivery> {
    const index = deliveries.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error("Delivery not found.");
    }

    const current = deliveries[index];

    const updated: Delivery = {
      ...current,
      orderReference: values.orderReference,
      customer: {
        ...current.customer,
        id: values.customerId,
      },
      address: {
        ...current.address,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        district: values.district,
        province: values.province,
        country: values.country,
        postalCode: values.postalCode,
      },
      deliveryFee: values.deliveryFee,
      estimatedDeliveryAt: values.estimatedDeliveryAt || null,
      deliveryNotes: values.deliveryNotes,
      updatedAt: new Date().toISOString(),
    };

    deliveries[index] = updated;
    return cloneDelivery(updated);
  },

  async updateDeliveryStatus(
    id: string,
    values: DeliveryStatusFormValues,
  ): Promise<Delivery> {
    const index = deliveries.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error("Delivery not found.");
    }

    const current = deliveries[index];

    if (!canTransitionDeliveryStatus(current.status, values.status)) {
      throw new Error(
        `A delivery cannot transition from ${current.status} to ${values.status}.`,
      );
    }

    if (values.status === "FAILED" && !values.failureReason?.trim()) {
      throw new Error("A failure reason is required.");
    }

    const timestamp = new Date().toISOString();

    const historyEntry: DeliveryStatusHistory = {
      id: generateId(),
      previousStatus: current.status,
      newStatus: values.status,
      note: values.note || values.failureReason,
      updatedBy: "Current user",
      createdAt: timestamp,
    };

    const updated: Delivery = {
      ...current,
      status: values.status,
      failureReason:
        values.status === "FAILED"
          ? values.failureReason
          : current.failureReason,
      dispatchedAt:
        values.status === "IN_TRANSIT"
          ? timestamp
          : current.dispatchedAt,
      deliveredAt:
        values.status === "DELIVERED"
          ? timestamp
          : current.deliveredAt,
      updatedAt: timestamp,
      statusHistory: [
        ...(current.statusHistory ?? []),
        historyEntry,
      ],
    };

    deliveries[index] = updated;
    return cloneDelivery(updated);
  },

  async deleteDelivery(id: string): Promise<void> {
    const delivery = deliveries.find((item) => item.id === id);

    if (!delivery) {
      throw new Error("Delivery not found.");
    }

    if (["IN_TRANSIT", "DELIVERED"].includes(delivery.status)) {
      throw new Error("This delivery cannot be deleted in its current status.");
    }

    deliveries = deliveries.filter((item) => item.id !== id);
  },
};
