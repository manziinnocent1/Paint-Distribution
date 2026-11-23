import type {
  InventoryStats,
  PaginatedMovementResponse,
  PaginatedStockResponse,
  StockAdjustmentValues,
  StockFilters,
  StockItem,
  StockMovement,
  StockMovementFilters,
  Warehouse,
  WarehouseValues,
} from "../types/inventory.types";

import { getStockStatus } from "../utils/inventory.utils";

const now = new Date();

const dateDaysAgo = (days: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

let stockItems: StockItem[] = [
  {
    id: "stock-001",
    productId: "product-001",
    productName: "Premium Emulsion Paint",
    productSku: "PEP-001",
    variantId: "variant-001",
    variantName: "20 Litres - White",
    categoryName: "Interior Paint",
    warehouseId: "warehouse-001",
    warehouseName: "Kigali Main Warehouse",
    quantity: 125,
    reservedQuantity: 15,
    minimumQuantity: 30,
    unit: "buckets",
    unitCost: 28000,
    sellingPrice: 35000,
    status: "in_stock",
    lastUpdated: dateDaysAgo(1),
  },
  {
    id: "stock-002",
    productId: "product-002",
    productName: "Weather Guard Exterior Paint",
    productSku: "WGP-002",
    variantId: "variant-002",
    variantName: "20 Litres - Cream",
    categoryName: "Exterior Paint",
    warehouseId: "warehouse-001",
    warehouseName: "Kigali Main Warehouse",
    quantity: 18,
    reservedQuantity: 3,
    minimumQuantity: 25,
    unit: "buckets",
    unitCost: 42000,
    sellingPrice: 52000,
    status: "low_stock",
    lastUpdated: dateDaysAgo(2),
  },
  {
    id: "stock-003",
    productId: "product-003",
    productName: "Gloss Enamel Paint",
    productSku: "GEP-003",
    variantId: "variant-003",
    variantName: "4 Litres - Black",
    categoryName: "Enamel Paint",
    warehouseId: "warehouse-002",
    warehouseName: "Huye Distribution Warehouse",
    quantity: 0,
    reservedQuantity: 0,
    minimumQuantity: 10,
    unit: "cans",
    unitCost: 18000,
    sellingPrice: 24000,
    status: "out_of_stock",
    lastUpdated: dateDaysAgo(4),
  },
  {
    id: "stock-004",
    productId: "product-004",
    productName: "Wall Primer",
    productSku: "WPR-004",
    variantId: "variant-004",
    variantName: "20 Litres",
    categoryName: "Primers",
    warehouseId: "warehouse-001",
    warehouseName: "Kigali Main Warehouse",
    quantity: 64,
    reservedQuantity: 8,
    minimumQuantity: 15,
    unit: "buckets",
    unitCost: 22000,
    sellingPrice: 29000,
    status: "in_stock",
    lastUpdated: dateDaysAgo(3),
  },
  {
    id: "stock-005",
    productId: "product-005",
    productName: "Acrylic Wall Paint",
    productSku: "AWP-005",
    variantId: "variant-005",
    variantName: "5 Litres - Blue",
    categoryName: "Interior Paint",
    warehouseId: "warehouse-002",
    warehouseName: "Huye Distribution Warehouse",
    quantity: 8,
    reservedQuantity: 2,
    minimumQuantity: 12,
    unit: "cans",
    unitCost: 12000,
    sellingPrice: 16500,
    status: "low_stock",
    lastUpdated: dateDaysAgo(1),
  },
];

let warehouses: Warehouse[] = [
  {
    id: "warehouse-001",
    name: "Kigali Main Warehouse",
    code: "KGL-MAIN",
    description: "Main storage and distribution warehouse.",
    address: "KN 5 Road",
    city: "Kigali",
    managerName: "Warehouse Manager",
    contactNumber: "+250788000001",
    status: "active",
    totalProducts: 3,
    totalQuantity: 207,
    createdAt: dateDaysAgo(180),
  },
  {
    id: "warehouse-002",
    name: "Huye Distribution Warehouse",
    code: "HYE-DIST",
    description: "Southern Province distribution warehouse.",
    address: "Huye Town",
    city: "Huye",
    managerName: "Distribution Manager",
    contactNumber: "+250788000002",
    status: "active",
    totalProducts: 2,
    totalQuantity: 8,
    createdAt: dateDaysAgo(90),
  },
  {
    id: "warehouse-003",
    name: "Rubavu Storage",
    code: "RBV-STOR",
    description: "Western Province storage facility.",
    address: "Rubavu Town",
    city: "Rubavu",
    status: "inactive",
    totalProducts: 0,
    totalQuantity: 0,
    createdAt: dateDaysAgo(60),
  },
];

let movements: StockMovement[] = [
  {
    id: "movement-001",
    stockItemId: "stock-001",
    productName: "Premium Emulsion Paint",
    productSku: "PEP-001",
    warehouseId: "warehouse-001",
    warehouseName: "Kigali Main Warehouse",
    movementType: "stock_in",
    quantity: 50,
    previousQuantity: 75,
    newQuantity: 125,
    referenceNumber: "PO-2026-001",
    reason: "New purchase order received.",
    performedBy: "Inventory Administrator",
    movementDate: dateDaysAgo(1),
  },
  {
    id: "movement-002",
    stockItemId: "stock-002",
    productName: "Weather Guard Exterior Paint",
    productSku: "WGP-002",
    warehouseId: "warehouse-001",
    warehouseName: "Kigali Main Warehouse",
    movementType: "stock_out",
    quantity: 12,
    previousQuantity: 30,
    newQuantity: 18,
    referenceNumber: "SO-2026-014",
    reason: "Customer order fulfilled.",
    performedBy: "Sales Officer",
    movementDate: dateDaysAgo(2),
  },
  {
    id: "movement-003",
    stockItemId: "stock-004",
    productName: "Wall Primer",
    productSku: "WPR-004",
    warehouseId: "warehouse-001",
    warehouseName: "Kigali Main Warehouse",
    movementType: "adjustment",
    quantity: 4,
    previousQuantity: 60,
    newQuantity: 64,
    referenceNumber: "ADJ-2026-003",
    reason: "Physical stock count correction.",
    performedBy: "Inventory Administrator",
    movementDate: dateDaysAgo(3),
  },
];

function updateWarehouseTotals() {
  warehouses = warehouses.map((warehouse) => {
    const warehouseStock = stockItems.filter(
      (item) => item.warehouseId === warehouse.id,
    );

    return {
      ...warehouse,
      totalProducts: warehouseStock.length,
      totalQuantity: warehouseStock.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
    };
  });
}

function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 10,
) {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const start = (safePage - 1) * safePageSize;

  return {
    results: items.slice(start, start + safePageSize),
    count: items.length,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.max(1, Math.ceil(items.length / safePageSize)),
  };
}

export const inventoryService = {
  async getStock(filters: StockFilters = {}): Promise<PaginatedStockResponse> {
    let result = [...stockItems];

    if (filters.search?.trim()) {
      const search = filters.search.toLowerCase();

      result = result.filter(
        (item) =>
          item.productName.toLowerCase().includes(search) ||
          item.productSku.toLowerCase().includes(search) ||
          item.variantName?.toLowerCase().includes(search),
      );
    }

    if (filters.status && filters.status !== "all") {
      result = result.filter((item) => item.status === filters.status);
    }

    if (filters.warehouseId) {
      result = result.filter(
        (item) => item.warehouseId === filters.warehouseId,
      );
    }

    if (filters.category) {
      result = result.filter(
        (item) => item.categoryName === filters.category,
      );
    }

    if (filters.ordering === "quantity") {
      result.sort((a, b) => a.quantity - b.quantity);
    } else if (filters.ordering === "-quantity") {
      result.sort((a, b) => b.quantity - a.quantity);
    } else {
      result.sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() -
          new Date(a.lastUpdated).getTime(),
      );
    }

    return paginate(
      result,
      filters.page,
      filters.pageSize,
    );
  },

  async getStockById(id: string): Promise<StockItem> {
    const item = stockItems.find((stock) => stock.id === id);

    if (!item) {
      throw new Error("Stock item not found.");
    }

    return item;
  },

  async getStats(): Promise<InventoryStats> {
    return {
      totalProducts: stockItems.length,
      totalQuantity: stockItems.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
      totalStockValue: stockItems.reduce(
        (total, item) => total + item.quantity * item.unitCost,
        0,
      ),
      lowStockItems: stockItems.filter(
        (item) => item.status === "low_stock",
      ).length,
      outOfStockItems: stockItems.filter(
        (item) => item.status === "out_of_stock",
      ).length,
      activeWarehouses: warehouses.filter(
        (warehouse) => warehouse.status === "active",
      ).length,
    };
  },

  async getLowStock(): Promise<StockItem[]> {
    return stockItems.filter(
      (item) =>
        item.status === "low_stock" ||
        item.status === "out_of_stock",
    );
  },

  async getWarehouses(): Promise<Warehouse[]> {
    return [...warehouses];
  },

  async getWarehouseById(id: string): Promise<Warehouse> {
    const warehouse = warehouses.find((item) => item.id === id);

    if (!warehouse) {
      throw new Error("Warehouse not found.");
    }

    return warehouse;
  },

  async createWarehouse(values: WarehouseValues): Promise<Warehouse> {
    const duplicateCode = warehouses.some(
      (item) => item.code.toLowerCase() === values.code.toLowerCase(),
    );

    if (duplicateCode) {
      throw new Error("A warehouse with this code already exists.");
    }

    const warehouse: Warehouse = {
      ...values,
      id: crypto.randomUUID(),
      totalProducts: 0,
      totalQuantity: 0,
      createdAt: new Date().toISOString(),
    };

    warehouses = [warehouse, ...warehouses];

    return warehouse;
  },

  async updateWarehouse(
    id: string,
    values: WarehouseValues,
  ): Promise<Warehouse> {
    const existing = await this.getWarehouseById(id);

    const duplicateCode = warehouses.some(
      (item) =>
        item.id !== id &&
        item.code.toLowerCase() === values.code.toLowerCase(),
    );

    if (duplicateCode) {
      throw new Error("A warehouse with this code already exists.");
    }

    const updated = { ...existing, ...values };

    warehouses = warehouses.map((item) =>
      item.id === id ? updated : item,
    );

    return updated;
  },

  async getMovements(
    filters: StockMovementFilters = {},
  ): Promise<PaginatedMovementResponse> {
    let result = [...movements];

    if (filters.search?.trim()) {
      const search = filters.search.toLowerCase();

      result = result.filter(
        (item) =>
          item.productName.toLowerCase().includes(search) ||
          item.productSku.toLowerCase().includes(search) ||
          item.referenceNumber.toLowerCase().includes(search),
      );
    }

    if (filters.movementType && filters.movementType !== "all") {
      result = result.filter(
        (item) => item.movementType === filters.movementType,
      );
    }

    if (filters.warehouseId) {
      result = result.filter(
        (item) => item.warehouseId === filters.warehouseId,
      );
    }

    if (filters.startDate) {
      result = result.filter(
        (item) =>
          new Date(item.movementDate) >= new Date(filters.startDate!),
      );
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);

      result = result.filter(
        (item) => new Date(item.movementDate) <= end,
      );
    }

    result.sort(
      (a, b) =>
        new Date(b.movementDate).getTime() -
        new Date(a.movementDate).getTime(),
    );

    return paginate(result, filters.page, filters.pageSize);
  },

  async createAdjustment(
    values: StockAdjustmentValues,
  ): Promise<StockMovement> {
    const stock = await this.getStockById(values.stockItemId);

    const previousQuantity = stock.quantity;
    let newQuantity = previousQuantity;

    switch (values.movementType) {
      case "stock_in":
        newQuantity += values.quantity;
        break;

      case "stock_out":
        if (values.quantity > stock.quantity - stock.reservedQuantity) {
          throw new Error("The requested quantity exceeds available stock.");
        }
        newQuantity -= values.quantity;
        break;

      case "adjustment":
        newQuantity = values.quantity;
        break;

      case "transfer":
        throw new Error(
          "Transfers require a destination warehouse and are not supported by this adjustment form.",
        );
    }

    if (newQuantity < 0) {
      throw new Error("Stock quantity cannot be negative.");
    }

    const updatedStock: StockItem = {
      ...stock,
      quantity: newQuantity,
      status: getStockStatus(newQuantity, stock.minimumQuantity),
      lastUpdated: new Date().toISOString(),
    };

    stockItems = stockItems.map((item) =>
      item.id === stock.id ? updatedStock : item,
    );

    const movement: StockMovement = {
      id: crypto.randomUUID(),
      stockItemId: stock.id,
      productName: stock.productName,
      productSku: stock.productSku,
      warehouseId: stock.warehouseId,
      warehouseName: stock.warehouseName,
      movementType: values.movementType,
      quantity: values.quantity,
      previousQuantity,
      newQuantity,
      referenceNumber: values.referenceNumber,
      reason: values.reason,
      performedBy: "Current User",
      movementDate: new Date(values.movementDate).toISOString(),
    };

    movements = [movement, ...movements];

    updateWarehouseTotals();

    return movement;
  },
};