import type { AccountFilters as AccountFilterValues } from "../types/account.types";

interface AccountFiltersProps {
  filters: AccountFilterValues;
  onChange: (filters: AccountFilterValues) => void;
}

const roles = [
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Manager" },
  { value: "accountant", label: "Accountant" },
  { value: "sales_person", label: "Sales Person" },
  { value: "inventory_manager", label: "Inventory Manager" },
];

export default function AccountFilters({
  filters,
  onChange,
}: AccountFiltersProps) {
  const updateFilter = (
    key: keyof AccountFilterValues,
    value: string | boolean | "",
  ) => {
    onChange({
      ...filters,
      [key]: value,
      page: 1,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div>
        <label
          htmlFor="account-search"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Search accounts
        </label>
        <input
          id="account-search"
          type="search"
          value={filters.search ?? ""}
          onChange={(event) => updateFilter("search", event.target.value)}
          placeholder="Search by name or email"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="account-role"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Role
        </label>
        <select
          id="account-role"
          value={filters.role ?? ""}
          onChange={(event) => updateFilter("role", event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All roles</option>
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="account-status"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Account status
        </label>
        <select
          id="account-status"
          value={
            filters.is_active === "" ? "" : String(filters.is_active ?? "")
          }
          onChange={(event) => {
            const value = event.target.value;

            updateFilter("is_active", value === "" ? "" : value === "true");
          }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
    </div>
  );
}
