import * as React from "react";
import {
  Bell,
  Search,
  Menu,
  UserCircle,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Dropdown } from "../../components/ui";

export interface HeaderProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
  notificationCount?: number;
  onMenuClick?: () => void;
  onSearch?: (value: string) => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
}

export function Header({
  userName = "Administrator",
  userEmail = "admin@example.com",
  userRole = "Administrator",
  notificationCount = 0,
  onMenuClick,
  onSearch,
  onNotificationsClick,
  onProfileClick,
  onSettingsClick,
  onLogout,
}: HeaderProps) {
  const [search, setSearch] = React.useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(search.trim());
  };

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <form
          onSubmit={handleSearch}
          className="hidden w-full max-w-md sm:block"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, orders, customers..."
              aria-label="Search application"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <button
          type="button"
          onClick={onNotificationsClick}
          aria-label={`Notifications, ${notificationCount} unread`}
          className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        >
          <Bell className="h-5 w-5" />

          {notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>

        <div className="h-8 w-px bg-gray-200" />

        {/* User profile */}
        <Dropdown
          align="right"
          items={[
            {
              label: "My Profile",
              icon: <User className="h-4 w-4" />,
              onClick: () => onProfileClick?.(),
            },
            {
              label: "Settings",
              icon: <Settings className="h-4 w-4" />,
              onClick: () => onSettingsClick?.(),
            },
            {
              label: "Sign Out",
              icon: <LogOut className="h-4 w-4" />,
              danger: true,
              separator: true,
              onClick: () => onLogout?.(),
            },
          ]}
          trigger={
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                {initials || <UserCircle className="h-6 w-6" />}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-32 truncate text-sm font-semibold text-gray-800">
                  {userName}
                </p>
                <p className="max-w-32 truncate text-xs text-gray-500">
                  {userRole}
                </p>
              </div>
            </div>
          }
        />
      </div>
    </header>
  );
}
