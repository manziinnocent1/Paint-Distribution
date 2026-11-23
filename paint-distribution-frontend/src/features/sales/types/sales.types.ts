export type SaleStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "processing"
  | "completed"
  | "cancelled";

export type SalePaymentStatus =
  | "unpaid"
  | "partially_paid"
  | "paid"
  | "refunded";

export type SalePaymentMethod =
  | "cash"
  | "mobile_money"
  | "card"
  | "bank_transfer"
  | "credit";

export type SaleItem = {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  taxPercentage: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
};

export type SaleCustomer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
};

export type Sale = {
  id: string;
  saleNumber: string;
  customer: SaleCustomer;
  items: SaleItem[];
  status: SaleStatus;
  paymentStatus: SalePaymentStatus;
  paymentMethod?: SalePaymentMethod;
  saleDate: string;
  expectedDeliveryDate?: string;
  completedAt?: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  currency: string;
  notes?: string;
  termsAndConditions?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type SaleItemInput = {
  productId: string;
  productName: string;
  productSku: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  taxPercentage: number;
};

export type CreateSaleInput = {
  customer: SaleCustomer;
  items: SaleItemInput[];
  saleDate: string;
  expectedDeliveryDate?: string;
  paymentMethod?: SalePaymentMethod;
  amountPaid: number;
  notes?: string;
  termsAndConditions?: string;
  currency: string;
  status: SaleStatus;
};

export type UpdateSaleInput = Partial<CreateSaleInput>;

export type SalesFilters = {
  search?: string;
  status?: SaleStatus | "";
  paymentStatus?: SalePaymentStatus | "";
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type SalesListResponse = {
  results: Sale[];
  count: number;
  page: number;
  pageSize: number;
};

export type SalesStats = {
  totalSales: number;
  totalRevenue: number;
  completedSales: number;
  pendingSales: number;
  cancelledSales: number;
  outstandingBalance: number;
  averageSaleValue: number;
  paidSales: number;
};

export type SaleTimelineEvent = {
  id: string;
  saleId: string;
  title: string;
  description?: string;
  date: string;
  user: string;
  type: "created" | "updated" | "confirmed" | "completed" | "cancelled";
};

export type RecordSalePaymentInput = {
  amount: number;
  method: SalePaymentMethod;
  paymentDate: string;
  reference?: string;
  notes?: string;
};