
/* ============================================================
   TYPES
============================================================ */

export type * from "./types/customer.types";

/* ============================================================
   CONSTANTS
============================================================ */

export * from "./constants/customer.constants";

/* ============================================================
   SCHEMAS
============================================================ */

export * from "./schemas/customer.schema";

/* ============================================================
   UTILITIES
============================================================ */

export * from "./utils/customer.utils";

/* ============================================================
   SERVICES
============================================================ */

export * from "./services/customerService";

/* ============================================================
   HOOKS
============================================================ */

export * from "./hooks/useCustomer";
export * from "./hooks/useCustomer";
export * from "./hooks/useCustomerAddresses";
export * from "./hooks/useCustomerMutations";

/* ============================================================
   SHARED COMPONENTS
============================================================ */

export * from "./components/shared/CustomerAvatar";
export * from "./components/shared/CustomerStatusBadge";
export * from "./components/shared/CustomerTypeBadge";
export * from "./components/shared/CustomerSelector";

/* ============================================================
   CUSTOMER COMPONENTS
============================================================ */

export * from "./components/CustomerTable";
export * from "./components/CustomerCard";
export * from "./components/CustomerForm";
export * from "./components/CustomerDetails";
export * from "./components/CustomerFilters";
export * from "./components/CustomerStats";

/* ============================================================
   ADDRESS COMPONENTS
============================================================ */

export * from "./components/addresses/CustomerAddressForm";
export * from "./components/addresses/CustomerAddressCard";
export * from "./components/addresses/CustomerAddressList";

/* ============================================================
   PAGES
============================================================ */

export { default as CustomersPage } from "./pages/CustomersPage";
export { default as CustomerDetailsPage } from "./pages/CustomerDetailsPage";
export { default as CustomerAddressesPage } from "./pages/CustomerAddressesPage";
