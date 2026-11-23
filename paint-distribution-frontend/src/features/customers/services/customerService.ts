
import type {
  Customer,
  CustomerAddress,
  CustomerFilters,
  CustomerFormValues,
  CustomerAddressPayload,
  PaginatedCustomers,
} from "../types/customer.types";

import { filterCustomersLocally } from "../utils/customer.utils";

const delay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const now = () => new Date().toISOString();

let customers: Customer[] = [];

let addresses: CustomerAddress[] = [];

function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 10,
) {
  const start = (page - 1) * pageSize;

  return {
    count: items.length,
    next: start + pageSize < items.length
      ? String(page + 1)
      : null,
    previous: page > 1 ? String(page - 1) : null,
    results: items.slice(start, start + pageSize),
  };
}

function sortCustomers(
  items: Customer[],
  ordering = "-created_at",
) {
  const descending = ordering.startsWith("-");
  const field = descending ? ordering.slice(1) : ordering;

  return [...items].sort((a, b) => {
    const left = String(
      a[field as keyof Customer] ?? "",
    );

    const right = String(
      b[field as keyof Customer] ?? "",
    );

    return descending
      ? right.localeCompare(left)
      : left.localeCompare(right);
  });
}

function createCustomerNumber(): string {
  const sequence = customers.length + 1;

  return `CUS-${String(sequence).padStart(5, "0")}`;
}

export const customerService = {
  async getCustomers(
    filters: CustomerFilters = {},
  ): Promise<PaginatedCustomers> {
    await delay();

    let result = filterCustomersLocally(
      customers,
      filters.search ?? "",
    );

    if (filters.status) {
      result = result.filter(
        (customer) => customer.status === filters.status,
      );
    }

    if (filters.customer_type) {
      result = result.filter(
        (customer) =>
          customer.customer_type === filters.customer_type,
      );
    }

    if (filters.city) {
      result = result.filter((customer) =>
        addresses.some(
          (address) =>
            address.customer === customer.id &&
            address.city.toLowerCase().includes(
              filters.city!.toLowerCase(),
            ),
        ),
      );
    }

    result = sortCustomers(
      result,
      filters.ordering,
    );

    return paginate(
      result,
      filters.page ?? 1,
      filters.page_size ?? 10,
    );
  },

  async getCustomer(id: string): Promise<Customer> {
    await delay();

    const customer = customers.find(
      (item) => item.id === id,
    );

    if (!customer) {
      throw new Error("Customer not found.");
    }

    return {
      ...customer,
      addresses: addresses.filter(
        (address) => address.customer === id,
      ),
    };
  },

  async createCustomer(
    payload: CustomerFormValues,
  ): Promise<Customer> {
    await delay();

    const duplicatePhone = customers.some(
      (customer) =>
        customer.phone_number === payload.phone_number,
    );

    if (duplicatePhone) {
      throw new Error(
        "A customer with this phone number already exists.",
      );
    }

    const timestamp = now();

    const customer: Customer = {
      ...payload,
      id: crypto.randomUUID(),
      customer_number: createCustomerNumber(),
      created_at: timestamp,
      updated_at: timestamp,
      total_orders: 0,
      total_spent: 0,
      addresses: [],
    };

    customers = [customer, ...customers];

    return customer;
  },

  async updateCustomer(
    id: string,
    payload: Partial<CustomerFormValues>,
  ): Promise<Customer> {
    await delay();

    const index = customers.findIndex(
      (customer) => customer.id === id,
    );

    if (index === -1) {
      throw new Error("Customer not found.");
    }

    const updated: Customer = {
      ...customers[index],
      ...payload,
      updated_at: now(),
    };

    customers[index] = updated;

    return updated;
  },

  async deleteCustomer(id: string): Promise<void> {
    await delay();

    const exists = customers.some(
      (customer) => customer.id === id,
    );

    if (!exists) {
      throw new Error("Customer not found.");
    }

    customers = customers.filter(
      (customer) => customer.id !== id,
    );

    addresses = addresses.filter(
      (address) => address.customer !== id,
    );
  },

  async updateCustomerStatus(
    id: string,
    status: Customer["status"],
  ): Promise<Customer> {
    return this.updateCustomer(id, { status });
  },

  async getCustomerAddresses(
    customerId: string,
  ): Promise<CustomerAddress[]> {
    await delay();

    return addresses.filter(
      (address) => address.customer === customerId,
    );
  },

  async createCustomerAddress(
    payload: CustomerAddressPayload,
  ): Promise<CustomerAddress> {
    await delay();

    const customerExists = customers.some(
      (customer) => customer.id === payload.customer,
    );

    if (!customerExists) {
      throw new Error("Customer not found.");
    }

    if (payload.is_default) {
      addresses = addresses.map((address) =>
        address.customer === payload.customer
          ? { ...address, is_default: false }
          : address,
      );
    }

    const timestamp = now();

    const address: CustomerAddress = {
      ...payload,
      id: crypto.randomUUID(),
      created_at: timestamp,
      updated_at: timestamp,
    };

    addresses = [address, ...addresses];

    return address;
  },

  async updateCustomerAddress(
    id: string,
    payload: Partial<CustomerAddressPayload>,
  ): Promise<CustomerAddress> {
    await delay();

    const index = addresses.findIndex(
      (address) => address.id === id,
    );

    if (index === -1) {
      throw new Error("Address not found.");
    }

    const current = addresses[index];

    if (payload.is_default) {
      addresses = addresses.map((address) =>
        address.customer === current.customer
          ? { ...address, is_default: false }
          : address,
      );
    }

    const updated = {
      ...addresses[index],
      ...payload,
      updated_at: now(),
    };

    addresses[index] = updated;

    return updated;
  },

  async deleteCustomerAddress(id: string): Promise<void> {
    await delay();

    const exists = addresses.some(
      (address) => address.id === id,
    );

    if (!exists) {
      throw new Error("Address not found.");
    }

    addresses = addresses.filter(
      (address) => address.id !== id,
    );
  },
};
