import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header, type HeaderProps } from "./Header";
import { Footer } from "./Footer";

export interface MainLayoutProps {
  headerProps?: Omit<HeaderProps, "onMenuClick">;
  companyName?: string;
  version?: string;
}

export function MainLayout({
  headerProps,
  companyName = "Color Distribution",
  version = "1.0.0",
}: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    headerProps?.onLogout?.();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((previous) => !previous)}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          {...headerProps}
          onMenuClick={() => setMobileSidebarOpen(true)}
          onLogout={handleLogout}
          onProfileClick={() =>
            headerProps?.onProfileClick
              ? headerProps.onProfileClick()
              : navigate("/profile")
          }
          onSettingsClick={() =>
            headerProps?.onSettingsClick
              ? headerProps.onSettingsClick()
              : navigate("/settings")
          }
        />

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer companyName={companyName} version={version} />
      </div>
    </div>
  );
}
