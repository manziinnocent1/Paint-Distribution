export type SupplierStatus =
  | "active"
  | "inactive"
  | "pending"
  | "suspended";

export type SupplierType =
  | "manufacturer"
  | "distributor"
  | "wholesaler"
  | "retailer"
  | "other";

export interface SupplierAddress {
  id: string;
  street: string;
  city: string;
  province?: string;
  country: string;
  postalCode?: string;
  isPrimary: boolean;
}

export interface SupplierContact {
  id: string;
  name: string;
  email?: string;
  phone: string;
  position?: string;
  isPrimary: boolean;
}

export interface SupplierProduct {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  currency: string;
  minimumOrderQuantity?: number;
  leadTimeDays?: number;
  isActive: boolean;
}

export interface SupplierPaymentSummary {
  totalPurchases: number;
  totalPaid: number;
  outstandingBalance: number;
  currency: string;
  lastPaymentDate?: string;
}

export interface Supplier {
  id: string;
  supplierCode: string;
  name: string;
  legalName?: string;
  type: SupplierType;
  status: SupplierStatus;
  email: string;
  phone: string;
  website?: string;
  taxIdentificationNumber?: string;
  registrationNumber?: string;
  description?: string;
  currency: string;
  paymentTerms?: string;
  creditLimit?: number;
  addresses: SupplierAddress[];
  contacts: SupplierContact[];
  products: SupplierProduct[];
  paymentSummary: SupplierPaymentSummary;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierInput {
  name: string;
  legalName?: string;
  type: SupplierType;
  status: SupplierStatus;
  email: string;
  phone: string;
  website?: string;
  taxIdentificationNumber?: string;
  registrationNumber?: string;
  description?: string;
  currency: string;
  paymentTerms?: string;
  creditLimit?: number;
  addresses: Omit<SupplierAddress, "id">[];
  contacts: Omit<SupplierContact, "id">[];
}

export type CreateSupplierInput = SupplierInput;

export type UpdateSupplierInput = Partial<SupplierInput>;

export interface SupplierFilters {
  search?: string;
  status?: SupplierStatus | "";
  type?: SupplierType | "";
  city?: string;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface SuppliersResponse {
  results: Supplier[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SupplierStats {
  totalSuppliers: number;
  activeSuppliers: number;
  inactiveSuppliers: number;
  pendingSuppliers: number;
  suspendedSuppliers: number;
  totalProducts: number;
  totalOutstandingBalance: number;
  currency: string;
}

export interface SupplierProductInput {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  currency: string;
  minimumOrderQuantity?: number;
  leadTimeDays?: number;
}

export interface SupplierTimelineEvent {
  id: string;
  type: "created" | "updated" | "status_changed" | "product_added";
  title: string;
  description?: string;
  createdAt: string;
}