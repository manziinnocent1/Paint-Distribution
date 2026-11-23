
import {
  ClipboardList,
  Package,
  PlusCircle,
  ShoppingCart,
  Users,
} from "lucide-react";

import type { DashboardQuickAction } from "../types/dashboard.types";

export const DASHBOARD_QUICK_ACTIONS: DashboardQuickAction[] = [
  {
    id: "new-sale",
    title: "Create a sale",
    description: "Record a new customer sale",
    icon: "shopping-cart",
    href: "/sales/new",
  },
  {
    id: "add-product",
    title: "Add product",
    description: "Register a paint product",
    icon: "package",
    href: "/products/new",
  },
  {
    id: "new-customer",
    title: "Add customer",
    description: "Register a new customer",
    icon: "users",
    href: "/customers/new",
  },
  {
    id: "new-purchase",
    title: "Record purchase",
    description: "Create a supplier purchase",
    icon: "clipboard-list",
    href: "/purchases/new",
  },
];

export const QUICK_ACTION_ICONS = {
  "shopping-cart": ShoppingCart,
  package: Package,
  users: Users,
  "clipboard-list": ClipboardList,
  "plus-circle": PlusCircle,
};
