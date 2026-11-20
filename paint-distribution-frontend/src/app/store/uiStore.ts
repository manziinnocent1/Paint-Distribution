
import { create } from "zustand";

interface UIState {
  // Sidebar state
  isSidebarOpen: boolean;
  isMobileSidebarOpen: boolean;

  // Sidebar actions
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  // Mobile sidebar actions
  toggleMobileSidebar: () => void;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isSidebarOpen: true,
  isMobileSidebarOpen: false,

  // Desktop sidebar actions
  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),

  openSidebar: () =>
    set({
      isSidebarOpen: true,
    }),

  closeSidebar: () =>
    set({
      isSidebarOpen: false,
    }),

  // Mobile sidebar actions
  toggleMobileSidebar: () =>
    set((state) => ({
      isMobileSidebarOpen: !state.isMobileSidebarOpen,
    })),

  openMobileSidebar: () =>
    set({
      isMobileSidebarOpen: true,
    }),

  closeMobileSidebar: () =>
    set({
      isMobileSidebarOpen: false,
    }),
}));
