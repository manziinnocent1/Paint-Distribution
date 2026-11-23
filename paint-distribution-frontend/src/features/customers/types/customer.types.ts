
export type CustomerStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type CustomerType = "INDIVIDUAL" | "BUSINESS";

export interface CustomerAddress {
  id: string;
  customer: string;
  address_type: "BILLING" | "SHIPPING" | "BOTH";
  address_line_1: string;
  address_line_2?: string;
  city: string;
  district?: string;
  province?: string;
  country: string;
  postal_code?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  customer_number: string;
  customer_type: CustomerType;
  first_name: string;
  last_name: string;
  business_name?: string;
  email?: string;
  phone_number: string;
  alternate_phone_number?: string;
  tax_identification_number?: string;
  status: CustomerStatus;
  notes?: string;
  addresses?: CustomerAddress[];
  total_orders?: number;
  total_spent?: number | string;
  last_order_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerFormValues {
  customer_type: CustomerType;
  first_name: string;
  last_name: string;
  business_name?: string;
  email?: string;
  phone_number: string;
  alternate_phone_number?: string;
  tax_identification_number?: string;
  notes?: string;
  status: CustomerStatus;
}

export interface CreateCustomerPayload extends CustomerFormValues {}

export interface UpdateCustomerPayload extends Partial<CustomerFormValues> {}

export interface CustomerAddressFormValues {
  address_type: "BILLING" | "SHIPPING" | "BOTH";
  address_line_1: string;
  address_line_2?: string;
  city: string;
  district?: string;
  province?: string;
  country: string;
  postal_code?: string;
  is_default: boolean;
}

export interface CustomerFilters {
  search?: string;
  customer_type?: CustomerType | "";
  status?: CustomerStatus | "";
  city?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedCustomers {
  count: number;
  next: string | null;
  previous: string | null;
  results: Customer[];
}

export interface CustomerStats {
  total_customers: number;
  active_customers: number;
  inactive_customers: number;
  suspended_customers: number;
  individual_customers: number;
  business_customers: number;
}

export interface CustomerAddressPayload extends CustomerAddressFormValues {
  customer: string;
}

export interface CustomerSelectOption {
  value: string;
  label: string;
  customer_number: string;
  phone_number: string;
}
