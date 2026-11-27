export const ROUTES = {
  root: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",

  dashboard: "/dashboard",

  accounts: "/accounts",
  analytics: "/analytics",
  audit: "/audit",
  catalog: "/catalog",
  colors: "/colors",
  customers: "/customers",
  deliveries: "/deliveries",
  expenses: "/expenses",
  inventory: "/inventory",
  notifications: "/notifications",
  payments: "/payments",
  pricing: "/pricing",
  procurement: "/procurement",
  sales: "/sales",
  suppliers: "/suppliers",

  notFound: "*",
} as const;

export type AppRole =
  | "admin"
  | "manager"
  | "sales_manager"
  | "sales_person"
  | "inventory_manager"
  | "storekeeper"
  | "procurement_officer"
  | "accountant"
  | "production_manager"
  | "production_operator"
  | "delivery_manager";

export const USER_ROLES: AppRole[] = [
  "admin",
  "manager",
  "sales_manager",
  "sales_person",
  "inventory_manager",
  "storekeeper",
  "procurement_officer",
  "accountant",
  "production_manager",
  "production_operator",
  "delivery_manager",
];

export interface RouteDefinition {
  path: string;
  title: string;
  description: string;
  allowedRoles?: AppRole[];
}

export const PUBLIC_ROUTES = [
  ROUTES.login,
  ROUTES.register,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
];

export const PROTECTED_ROUTES: RouteDefinition[] = [
  {
    path: ROUTES.dashboard,
    title: "Dashboard",
    description: "Overview of your paint distribution business.",
  },
  {
    path: ROUTES.accounts,
    title: "Accounts",
    description: "Manage users, accounts and system roles.",
    allowedRoles: ["admin", "manager"],
  },
  {
    path: ROUTES.analytics,
    title: "Analytics",
    description: "Business performance, reports and insights.",
    allowedRoles: ["admin", "manager", "sales_manager", "accountant"],
  },
  {
    path: ROUTES.audit,
    title: "Audit",
    description: "Review system activities and audit records.",
    allowedRoles: ["admin", "manager"],
  },
  {
    path: ROUTES.catalog,
    title: "Product Catalog",
    description: "Manage products, variants and product categories.",
  },
  {
    path: ROUTES.colors,
    title: "Colors",
    description: "Manage paint colors, color families and custom mixtures.",
  },
  {
    path: ROUTES.customers,
    title: "Customers",
    description: "Manage customer profiles and customer information.",
  },
  {
    path: ROUTES.deliveries,
    title: "Deliveries",
    description: "Manage customer deliveries and delivery status.",
  },
  {
    path: ROUTES.expenses,
    title: "Expenses",
    description: "Track and manage business expenses.",
    allowedRoles: ["admin", "manager", "accountant"],
  },
  {
    path: ROUTES.inventory,
    title: "Inventory",
    description: "Manage warehouses, stock levels and stock movements.",
  },
  {
    path: ROUTES.notifications,
    title: "Notifications",
    description: "View system notifications and important updates.",
  },
  {
    path: ROUTES.payments,
    title: "Payments",
    description: "Manage payments, transactions and refunds.",
    allowedRoles: ["admin", "manager", "accountant"],
  },
  {
    path: ROUTES.pricing,
    title: "Pricing",
    description: "Manage product prices, discounts and pricing rules.",
  },
  {
    path: ROUTES.procurement,
    title: "Procurement",
    description: "Manage purchase requests, orders and receipts.",
  },
  {
    path: ROUTES.sales,
    title: "Sales",
    description: "Manage sales transactions and customer orders.",
  },
  {
    path: ROUTES.suppliers,
    title: "Suppliers",
    description: "Manage suppliers, contacts and supplier products.",
  },
];
