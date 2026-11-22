import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Palette,
  Boxes,
  Warehouse,
  Truck,
  ShoppingCart,
  ShoppingBag,
  Users,
  UserRound,
  BarChart3,
  Settings,
  X,
  Paintbrush,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  mobileOpen?: boolean;
  onClose?: () => void;
}

const navigationGroups: NavigationGroup[] = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "BUSINESS MANAGEMENT",
    items: [
      {
        label: "Products",
        path: "/products",
        icon: Package,
      },
      {
        label: "Colors & Formulas",
        path: "/colors",
        icon: Palette,
      },
      {
        label: "Inventory",
        path: "/inventory",
        icon: Boxes,
      },
      {
        label: "Warehouses",
        path: "/warehouses",
        icon: Warehouse,
      },
      {
        label: "Suppliers",
        path: "/suppliers",
        icon: Truck,
      },
      {
        label: "Customers",
        path: "/customers",
        icon: Users,
      },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      {
        label: "Sales",
        path: "/sales",
        icon: ShoppingCart,
      },
      {
        label: "Procurement",
        path: "/procurement",
        icon: ShoppingBag,
      },
    ],
  },
  {
    title: "INSIGHTS",
    items: [
      {
        label: "Analytics",
        path: "/analytics",
        icon: BarChart3,
      },
      {
        label: "Reports",
        path: "/reports",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        label: "Users",
        path: "/users",
        icon: UserRound,
      },
      {
        label: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ],
  },
];

export function Sidebar({
  collapsed = false,
  onToggle,
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  const location = useLocation();

  const renderNavigation = () => (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {navigationGroups.map((group) => (
        <div key={group.title}>
          {!collapsed && (
            <h3 className="mb-2 px-3 text-[10px] font-bold tracking-widest text-gray-400">
              {group.title}
            </h3>
          )}

          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;

              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  title={collapsed ? item.label : undefined}
                  onClick={onClose}
                  className={({ isActive: routeActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      routeActive || isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                      collapsed && "justify-center px-2",
                    )
                  }
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-600",
                    )}
                  />

                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-200 bg-white transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "lg:static lg:z-auto lg:h-screen",
        )}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Paintbrush className="h-5 w-5" />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold text-gray-900">
                  Color Distribution
                </h1>
                <p className="text-[10px] text-gray-500">Management System</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {renderNavigation()}

        {/* Collapse button */}
        <div className="hidden border-t border-gray-100 p-3 lg:block">
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex w-full items-center justify-center rounded-lg py-2 text-gray-500 hover:bg-gray-100"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <div className="flex items-center gap-3 text-sm">
                <ChevronLeft className="h-4 w-4" />
                Collapse sidebar
              </div>
            )}
          </button>
        </div>

        {/* Footer branding */}
        {!collapsed && (
          <div className="border-t border-gray-100 px-5 py-3">
            <p className="text-[11px] text-gray-400">
              Color Distribution System
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
