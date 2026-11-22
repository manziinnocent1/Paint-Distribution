export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "approve"
  | "reject"
  | "cancel"
  | "activate"
  | "deactivate"
  | "archive"
  | "restore"
  | "view"
  | "export"
  | "import"
  | "other";

export type AuditEntity =
  | "user"
  | "product"
  | "color"
  | "color_formula"
  | "customer"
  | "supplier"
  | "warehouse"
  | "inventory"
  | "stock"
  | "purchase_order"
  | "sale"
  | "payment"
  | "delivery"
  | "settings"
  | "other";

export interface AuditActor {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface AuditLog {
  id: string;
  actor?: AuditActor | null;
  action: AuditAction | string;
  entity_type: AuditEntity | string;
  entity_id?: string | null;
  entity_name?: string | null;
  description: string;
  ip_address?: string | null;
  user_agent?: string | null;
  changes?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

export interface AuditFilters {
  search?: string;
  action?: string;
  entity_type?: string;
  actor?: string;
  start_date?: string;
  end_date?: string;
  page: number;
  page_size: number;
  ordering?: string;
}

export interface PaginatedAuditLogs {
  count: number;
  next: string | null;
  previous: string | null;
  results: AuditLog[];
}

export interface AuditSummary {
  total_events: number;
  today_events: number;
  create_events: number;
  update_events: number;
  delete_events: number;
  login_events: number;
}

export interface AuditApiError {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}