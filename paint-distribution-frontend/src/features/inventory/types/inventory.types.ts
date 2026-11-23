export type StockStatus =
  | "in_stock"
  | "low_stock"
  | "out_of_stock";

export type MovementType =
  | "stock_in"
  | "stock_out"
  | "adjustment"
  | "transfer";

export type WarehouseStatus = "active" | "inactive";

export interface StockItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  variantId?: string;
  variantName?: string;
  categoryName: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  reservedQuantity: number;
  minimumQuantity: number;
  unit: string;
  unitCost: number;
  sellingPrice: number;
  status: StockStatus;
  lastUpdated: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  description?: string;
  address: string;
  city: string;
  managerName?: string;
  contactNumber?: string;
  status: WarehouseStatus;
  totalProducts: number;
  totalQuantity: number;
  createdAt: string;
}

export interface StockMovement {
  id: string;
  stockItemId: string;
  productName: string;
  productSku: string;
  warehouseId: string;
  warehouseName: string;
  movementType: MovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  referenceNumber: string;
  reason: string;
  performedBy: string;
  movementDate: string;
}

export interface InventoryStats {
  totalProducts: number;
  totalQuantity: number;
  totalStockValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  activeWarehouses: number;
}

export interface StockFilters {
  search?: string;
  status?: StockStatus | "all";
  warehouseId?: string;
  category?: string;
  page?: number;
  pageSize?: number;
  ordering?: string;
}

export interface PaginatedStockResponse {
  results: StockItem[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface StockAdjustmentValues {
  stockItemId: string;
  movementType: MovementType;
  quantity: number;
  referenceNumber: string;
  reason: string;
  movementDate: string;
}

export interface WarehouseValues {
  name: string;
  code: string;
  description?: string;
  address: string;
  city: string;
  managerName?: string;
  contactNumber?: string;
  status: WarehouseStatus;
}

export interface StockMovementFilters {
  search?: string;
  movementType?: MovementType | "all";
  warehouseId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedMovementResponse {
  results: StockMovement[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}