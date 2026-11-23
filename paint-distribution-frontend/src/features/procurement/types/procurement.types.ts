export type ProcurementStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "ordered"
  | "partially_received"
  | "received"
  | "cancelled";

export type ProcurementPriority = "low" | "medium" | "high" | "urgent";

export type PurchaseOrderStatus =
  | "draft"
  | "pending"
  | "approved"
  | "sent"
  | "partially_received"
  | "received"
  | "cancelled";

export type GoodsReceiptStatus = "pending" | "inspected" | "accepted" | "rejected";

export interface ProcurementItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  estimatedUnitPrice: number;
  receivedQuantity?: number;
  notes?: string;
}

export interface ProcurementRequest {
  id: string;
  requestNumber: string;
  title: string;
  description: string;
  requestedBy: string;
  department: string;
  priority: ProcurementPriority;
  status: ProcurementStatus;
  requiredDate: string;
  items: ProcurementItem[];
  estimatedTotal: number;
  supplierId?: string;
  supplierName?: string;
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcurementRequestInput {
  title: string;
  description: string;
  department: string;
  priority: ProcurementPriority;
  requiredDate: string;
  items: Array<{
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    estimatedUnitPrice: number;
    notes?: string;
  }>;
}

export interface ProcurementFilters {
  search?: string;
  status?: ProcurementStatus | "";
  priority?: ProcurementPriority | "";
  department?: string;
  startDate?: string;
  endDate?: string;
}

export interface SupplierOption {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  receivedQuantity: number;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  procurementRequestId?: string;
  procurementRequestNumber?: string;
  supplierId: string;
  supplierName: string;
  status: PurchaseOrderStatus;
  orderDate: string;
  expectedDeliveryDate: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderInput {
  procurementRequestId?: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  items: Array<{
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }>;
  tax: number;
  notes?: string;
}

export interface GoodsReceiptItem {
  id: string;
  purchaseOrderItemId: string;
  productName: string;
  sku: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  notes?: string;
}

export interface GoodsReceipt {
  id: string;
  receiptNumber: string;
  purchaseOrderId: string;
  purchaseOrderNumber: string;
  supplierName: string;
  receivedDate: string;
  receivedBy: string;
  status: GoodsReceiptStatus;
  items: GoodsReceiptItem[];
  notes?: string;
  createdAt: string;
}

export interface GoodsReceiptInput {
  purchaseOrderId: string;
  receivedDate: string;
  items: Array<{
    purchaseOrderItemId: string;
    productName: string;
    sku: string;
    orderedQuantity: number;
    receivedQuantity: number;
    acceptedQuantity: number;
    rejectedQuantity: number;
    notes?: string;
  }>;
  notes?: string;
}

export interface ProcurementStatsData {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalEstimatedValue: number;
  activePurchaseOrders: number;
  receivedOrders: number;
}