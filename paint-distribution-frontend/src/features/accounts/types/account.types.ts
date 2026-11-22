
export type AccountRole =
  | "admin"
  | "manager"
  | "accountant"
  | "sales_person"
  | "inventory_manager"
  | "other";

export interface Account {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  date_joined?: string;
  last_login?: string | null;
}

export interface CreateAccountRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  password: string;
  role: string;
}

export interface UpdateAccountRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: string;
  is_active?: boolean;
}

export interface AccountFilters {
  search?: string;
  role?: string;
  is_active?: boolean | "";
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface PaginatedAccounts {
  count: number;
  next: string | null;
  previous: string | null;
  results: Account[];
}

export interface AccountFormValues {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  password: string;
  confirm_password: string;
  is_active: boolean;
}

export interface AccountApiError {
  detail?: string;
  message?: string;
  [field: string]: unknown;
}
