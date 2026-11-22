import type {
  AuditAction,
  AuditEntity,
} from "../types/audit.types";

export const formatAuditDate = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-RW", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
};

export const formatAuditDateOnly = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-RW", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

export const formatAuditTime = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-RW", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(parsedDate);
};

export const formatAuditAction = (action: string): string => {
  return action
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export const formatAuditEntity = (entity: string): string => {
  return entity
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export const getActorName = (
  actor?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null,
): string => {
  if (!actor) {
    return "System";
  }

  const fullName = [
    actor.first_name,
    actor.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || actor.email || "Unknown user";
};

export const getActionColor = (action: string): string => {
  const colors: Record<string, string> = {
    create: "bg-green-50 text-green-700",
    update: "bg-blue-50 text-blue-700",
    delete: "bg-red-50 text-red-700",
    login: "bg-purple-50 text-purple-700",
    logout: "bg-gray-100 text-gray-700",
    approve: "bg-emerald-50 text-emerald-700",
    reject: "bg-red-50 text-red-700",
    cancel: "bg-orange-50 text-orange-700",
    activate: "bg-green-50 text-green-700",
    deactivate: "bg-yellow-50 text-yellow-700",
    archive: "bg-gray-100 text-gray-700",
    restore: "bg-teal-50 text-teal-700",
    view: "bg-slate-100 text-slate-700",
    export: "bg-indigo-50 text-indigo-700",
    import: "bg-cyan-50 text-cyan-700",
  };

  return colors[action.toLowerCase()] ?? "bg-gray-100 text-gray-700";
};

export const getEntityColor = (entity: string): string => {
  const colors: Record<string, string> = {
    user: "bg-purple-50 text-purple-700",
    product: "bg-blue-50 text-blue-700",
    color: "bg-pink-50 text-pink-700",
    color_formula: "bg-fuchsia-50 text-fuchsia-700",
    customer: "bg-teal-50 text-teal-700",
    supplier: "bg-orange-50 text-orange-700",
    warehouse: "bg-indigo-50 text-indigo-700",
    inventory: "bg-yellow-50 text-yellow-700",
    stock: "bg-amber-50 text-amber-700",
    purchase_order: "bg-cyan-50 text-cyan-700",
    sale: "bg-green-50 text-green-700",
    payment: "bg-emerald-50 text-emerald-700",
    delivery: "bg-sky-50 text-sky-700",
    settings: "bg-gray-100 text-gray-700",
  };

  return colors[entity.toLowerCase()] ?? "bg-gray-100 text-gray-700";
};

export const auditActions: {
  label: string;
  value: AuditAction;
}[] = [
  { label: "Create", value: "create" },
  { label: "Update", value: "update" },
  { label: "Delete", value: "delete" },
  { label: "Login", value: "login" },
  { label: "Logout", value: "logout" },
  { label: "Approve", value: "approve" },
  { label: "Reject", value: "reject" },
  { label: "Cancel", value: "cancel" },
  { label: "Activate", value: "activate" },
  { label: "Deactivate", value: "deactivate" },
  { label: "Archive", value: "archive" },
  { label: "Restore", value: "restore" },
  { label: "View", value: "view" },
  { label: "Export", value: "export" },
  { label: "Import", value: "import" },
];

export const auditEntities: {
  label: string;
  value: AuditEntity;
}[] = [
  { label: "Users", value: "user" },
  { label: "Products", value: "product" },
  { label: "Colors", value: "color" },
  { label: "Color formulas", value: "color_formula" },
  { label: "Customers", value: "customer" },
  { label: "Suppliers", value: "supplier" },
  { label: "Warehouses", value: "warehouse" },
  { label: "Inventory", value: "inventory" },
  { label: "Stock", value: "stock" },
  { label: "Purchase orders", value: "purchase_order" },
  { label: "Sales", value: "sale" },
  { label: "Payments", value: "payment" },
  { label: "Deliveries", value: "delivery" },
  { label: "Settings", value: "settings" },
];