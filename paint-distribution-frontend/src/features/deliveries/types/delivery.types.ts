
export type DeliveryStatus =
  | "PENDING"
  | "PREPARING"
  | "READY"
  | "ASSIGNED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED"
  | "CANCELLED"
  | "RETURNED";

export type DeliveryVehicle =
  | "MOTORCYCLE"
  | "BICYCLE"
  | "CAR"
  | "VAN";

export type DeliveryDateRange =
  | "today"
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "all";

export interface DeliveryAddress {
  id?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district?: string;
  province?: string;
  country: string;
  postalCode?: string;
  landmark?: string;
}

export interface DeliveryCustomer {
  id: string;
  name: string;
  email?: string;
  phoneNumber: string;
}

export interface DeliveryDriver {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  vehicleType?: DeliveryVehicle;
  vehicleRegistration?: string;
}

export interface DeliveryStatusHistory {
  id: string;
  previousStatus: DeliveryStatus | null;
  newStatus: DeliveryStatus;
  note?: string;
  updatedBy?: string;
  createdAt: string;
}

export interface Delivery {
  id: string;
  deliveryNumber: string;
  trackingNumber: string;
  orderId?: string;
  orderReference: string;
  customer: DeliveryCustomer;
  address: DeliveryAddress;
  status: DeliveryStatus;
  driver?: DeliveryDriver | null;
  vehicleType?: DeliveryVehicle | null;
  vehicleRegistration?: string;
  deliveryFee: number;
  estimatedDeliveryAt?: string | null;
  dispatchedAt?: string | null;
  deliveredAt?: string | null;
  recipientName?: string;
  recipientPhone?: string;
  proofOfDelivery?: string | null;
  deliveryNotes?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory?: DeliveryStatusHistory[];
}

export interface DeliveryFormValues {
  orderReference: string;
  customerId: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district?: string;
  province?: string;
  country: string;
  postalCode?: string;
  deliveryFee: number;
  estimatedDeliveryAt?: string;
  deliveryNotes?: string;
}

export interface DeliveryStatusFormValues {
  status: DeliveryStatus;
  note?: string;
  failureReason?: string;
}

export interface DeliveryFilters {
  search: string;
  status: DeliveryStatus | "ALL";
  dateRange: DeliveryDateRange;
  page: number;
  pageSize: number;
  ordering: string;
}

export interface DeliveryStats {
  totalDeliveries: number;
  pendingDeliveries: number;
  inProgressDeliveries: number;
  deliveredDeliveries: number;
  failedDeliveries: number;
  cancelledDeliveries: number;
  totalDeliveryFees: number;
}

export interface PaginatedDeliveries {
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  results: Delivery[];
}

export interface DeliveryListResponse {
  success: boolean;
  data: PaginatedDeliveries;
}

export interface DeliveryApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface DeliveryStatusOption {
  value: DeliveryStatus;
  label: string;
}

export interface DeliveryVehicleOption {
  value: DeliveryVehicle;
  label: string;
}

export interface DeliveryActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status?: DeliveryStatus;
}
