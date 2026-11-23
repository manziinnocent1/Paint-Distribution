import type {
  CreateSupplierInput,
  Supplier,
  SupplierInput,
  SupplierProductInput,
  SupplierStats,
  SupplierTimelineEvent,
  SuppliersResponse,
  SupplierFilters,
  UpdateSupplierInput,
} from "../types/supplier.types";

const now = new Date().toISOString();

let suppliers: Supplier[] = [
  {
    id: "supplier-001",
    supplierCode: "SUP-0001",
    name: "Rwanda Paint Manufacturing Ltd",
    legalName: "Rwanda Paint Manufacturing Limited",
    type: "manufacturer",
    status: "active",
    email: "sales@rwandapaint.example",
    phone: "+250788100001",
    website: "https://example.com",
    taxIdentificationNumber: "TIN-100001",
    registrationNumber: "REG-100001",
    description: "Supplier of locally manufactured paint products.",
    currency: "RWF",
    paymentTerms: "30 days",
    creditLimit: 5000000,
    addresses: [
      {
        id: "address-001",
        street: "KN 5 Road",
        city: "Kigali",
        province: "Kigali",
        country: "Rwanda",
        isPrimary: true,
      },
    ],
    contacts: [
      {
        id: "contact-001",
        name: "Jean Claude",
        email: "jean@example.com",
        phone: "+250788100002",
        position: "Sales Manager",
        isPrimary: true,
      },
    ],
    products: [
      {
        id: "sp-001",
        productId: "product-001",
        productName: "Interior Wall Paint",
        sku: "INT-001",
        unitPrice: 25000,
        currency: "RWF",
        minimumOrderQuantity: 10,
        leadTimeDays: 3,
        isActive: true,
      },
    ],
    paymentSummary: {
      totalPurchases: 12500000,
      totalPaid: 10000000,
      outstandingBalance: 2500000,
      currency: "RWF",
      lastPaymentDate: "2026-10-15T10:00:00.000Z",
    },
    createdAt: "2026-01-10T08:00:00.000Z",
    updatedAt: now,
  },
  {
    id: "supplier-002",
    supplierCode: "SUP-0002",
    name: "East Africa Paint Distributors",
    legalName: "East Africa Paint Distributors Ltd",
    type: "distributor",
    status: "active",
    email: "info@eastafrica.example",
    phone: "+250788200001",
    currency: "RWF",
    paymentTerms: "15 days",
    creditLimit: 3000000,
    addresses: [
      {
        id: "address-002",
        street: "KG 11 Avenue",
        city: "Kigali",
        country: "Rwanda",
        isPrimary: true,
      },
    ],
    contacts: [
      {
        id: "contact-002",
        name: "Marie Uwase",
        email: "marie@example.com",
        phone: "+250788200002",
        position: "Account Manager",
        isPrimary: true,
      },
    ],
    products: [],
    paymentSummary: {
      totalPurchases: 8000000,
      totalPaid: 8000000,
      outstandingBalance: 0,
      currency: "RWF",
    },
    createdAt: "2026-02-12T08:00:00.000Z",
    updatedAt: now,
  },
  {
    id: "supplier-003",
    supplierCode: "SUP-0003",
    name: "Global Industrial Coatings",
    type: "wholesaler",
    status: "pending",
    email: "orders@globalcoatings.example",
    phone: "+250788300001",
    currency: "USD",
    paymentTerms: "Cash on delivery",
    addresses: [
      {
        id: "address-003",
        street: "Industrial Area",
        city: "Kampala",
        country: "Uganda",
        isPrimary: true,
      },
    ],
    contacts: [
      {
        id: "contact-003",
        name: "David Kato",
        phone: "+256700000001",
        position: "Director",
        isPrimary: true,
      },
    ],
    products: [],
    paymentSummary: {
      totalPurchases: 0,
      totalPaid: 0,
      outstandingBalance: 0,
      currency: "USD",
    },
    createdAt: "2026-03-05T08:00:00.000Z",
    updatedAt: now,
  },
];

let timeline: Record<string, SupplierTimelineEvent[]> = {
  "supplier-001": [
    {
      id: "event-001",
      type: "created",
      title: "Supplier registered",
      description: "Supplier account was created.",
      createdAt: "2026-01-10T08:00:00.000Z",
    },
    {
      id: "event-002",
      type: "updated",
      title: "Supplier information updated",
      createdAt: "2026-02-10T08:00:00.000Z",
    },
  ],
};

const delay = (ms = 200) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function createId(): string {
  return crypto.randomUUID();
}

function addTimelineEvent(
  supplierId: string,
  event: Omit<SupplierTimelineEvent, "id" | "createdAt">,
) {
  timeline[supplierId] ??= [];

  timeline[supplierId].unshift({
    ...event,
    id: createId(),
    createdAt: new Date().toISOString(),
  });
}

function toSupplier(
  input: SupplierInput,
  existing?: Supplier,
): Supplier {
  const timestamp = new Date().toISOString();

  return {
    id: existing?.id ?? createId(),
    supplierCode: existing?.supplierCode ?? `SUP-${String(suppliers.length + 1).padStart(4, "0")}`,
    name: input.name,
    legalName: input.legalName,
    type: input.type,
    status: input.status,
    email: input.email,
    phone: input.phone,
    website: input.website,
    taxIdentificationNumber: input.taxIdentificationNumber,
    registrationNumber: input.registrationNumber,
    description: input.description,
    currency: input.currency,
    paymentTerms: input.paymentTerms,
    creditLimit: input.creditLimit,
    addresses: input.addresses.map((address, index) => ({
      ...address,
      id: existing?.addresses[index]?.id ?? createId(),
    })),
    contacts: input.contacts.map((contact, index) => ({
      ...contact,
      id: existing?.contacts[index]?.id ?? createId(),
    })),
    products: existing?.products ?? [],
    paymentSummary: existing?.paymentSummary ?? {
      totalPurchases: 0,
      totalPaid: 0,
      outstandingBalance: 0,
      currency: input.currency,
    },
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
}

export const supplierService = {
  async getSuppliers(
    filters: SupplierFilters = {},
    page = 1,
    pageSize = 10,
  ): Promise<SuppliersResponse> {
    await delay();

    let result = [...suppliers];

    if (filters.search?.trim()) {
      const search = filters.search.toLowerCase();

      result = result.filter((supplier) =>
        [
          supplier.name,
          supplier.legalName,
          supplier.supplierCode,
          supplier.email,
          supplier.phone,
          ...supplier.addresses.map((address) => address.city),
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(search)),
      );
    }

    if (filters.status) {
      result = result.filter(
        (supplier) => supplier.status === filters.status,
      );
    }

    if (filters.type) {
      result = result.filter(
        (supplier) => supplier.type === filters.type,
      );
    }

    if (filters.city) {
      result = result.filter((supplier) =>
        supplier.addresses.some((address) =>
          address.city.toLowerCase().includes(filters.city!.toLowerCase()),
        ),
      );
    }

    const sortBy = filters.sortBy ?? "createdAt";
    const sortOrder = filters.sortOrder ?? "desc";

    result.sort((a, b) => {
      const first = a[sortBy];
      const second = b[sortBy];

      const comparison =
        String(first).localeCompare(String(second));

      return sortOrder === "asc" ? comparison : -comparison;
    });

    const count = result.length;
    const totalPages = Math.ceil(count / pageSize);

    return {
      results: result.slice((page - 1) * pageSize, page * pageSize),
      count,
      page,
      pageSize,
      totalPages,
    };
  },

  async getSupplier(id: string): Promise<Supplier> {
    await delay();

    const supplier = suppliers.find((item) => item.id === id);

    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    return supplier;
  },

  async getStats(): Promise<SupplierStats> {
    await delay();

    return {
      totalSuppliers: suppliers.length,
      activeSuppliers: suppliers.filter((s) => s.status === "active").length,
      inactiveSuppliers: suppliers.filter((s) => s.status === "inactive").length,
      pendingSuppliers: suppliers.filter((s) => s.status === "pending").length,
      suspendedSuppliers: suppliers.filter((s) => s.status === "suspended").length,
      totalProducts: suppliers.reduce(
        (total, supplier) => total + supplier.products.length,
        0,
      ),
      totalOutstandingBalance: suppliers
        .filter((supplier) => supplier.currency === "RWF")
        .reduce(
          (total, supplier) =>
            total + supplier.paymentSummary.outstandingBalance,
          0,
        ),
      currency: "RWF",
    };
  },

  async getTimeline(id: string): Promise<SupplierTimelineEvent[]> {
    await delay();

    if (!suppliers.some((supplier) => supplier.id === id)) {
      throw new Error("Supplier not found.");
    }

    return timeline[id] ?? [];
  },

  async createSupplier(input: CreateSupplierInput): Promise<Supplier> {
    await delay();

    const emailExists = suppliers.some(
      (supplier) => supplier.email.toLowerCase() === input.email.toLowerCase(),
    );

    if (emailExists) {
      throw new Error("A supplier with this email already exists.");
    }

    const supplier = toSupplier(input);

    suppliers = [supplier, ...suppliers];

    addTimelineEvent(supplier.id, {
      type: "created",
      title: "Supplier registered",
      description: `${supplier.name} was added to the supplier directory.`,
    });

    return supplier;
  },

  async updateSupplier(
    id: string,
    input: UpdateSupplierInput,
  ): Promise<Supplier> {
    await delay();

    const index = suppliers.findIndex((supplier) => supplier.id === id);

    if (index === -1) {
      throw new Error("Supplier not found.");
    }

    const existing = suppliers[index];

    if (
      input.email &&
      suppliers.some(
        (supplier) =>
          supplier.id !== id &&
          supplier.email.toLowerCase() === input.email!.toLowerCase(),
      )
    ) {
      throw new Error("Another supplier already uses this email.");
    }

    const merged: SupplierInput = {
      name: input.name ?? existing.name,
      legalName: input.legalName ?? existing.legalName,
      type: input.type ?? existing.type,
      status: input.status ?? existing.status,
      email: input.email ?? existing.email,
      phone: input.phone ?? existing.phone,
      website: input.website ?? existing.website,
      taxIdentificationNumber:
        input.taxIdentificationNumber ?? existing.taxIdentificationNumber,
      registrationNumber:
        input.registrationNumber ?? existing.registrationNumber,
      description: input.description ?? existing.description,
      currency: input.currency ?? existing.currency,
      paymentTerms: input.paymentTerms ?? existing.paymentTerms,
      creditLimit: input.creditLimit ?? existing.creditLimit,
      addresses:
        input.addresses ??
        existing.addresses.map(({ id: _id, ...address }) => address),
      contacts:
        input.contacts ??
        existing.contacts.map(({ id: _id, ...contact }) => contact),
    };

    const updated = toSupplier(merged, existing);
    suppliers[index] = updated;

    addTimelineEvent(id, {
      type: "updated",
      title: "Supplier information updated",
      description: "Supplier details were modified.",
    });

    if (input.status && input.status !== existing.status) {
      addTimelineEvent(id, {
        type: "status_changed",
        title: "Supplier status changed",
        description: `Status changed to ${input.status}.`,
      });
    }

    return updated;
  },

  async updateStatus(
    id: string,
    status: Supplier["status"],
  ): Promise<Supplier> {
    await delay();

    const supplier = suppliers.find((item) => item.id === id);

    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    supplier.status = status;
    supplier.updatedAt = new Date().toISOString();

    addTimelineEvent(id, {
      type: "status_changed",
      title: "Supplier status changed",
      description: `Supplier status is now ${status}.`,
    });

    return supplier;
  },

  async addProduct(
    supplierId: string,
    input: SupplierProductInput,
  ): Promise<Supplier> {
    await delay();

    const supplier = suppliers.find((item) => item.id === supplierId);

    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    const product = {
      ...input,
      id: createId(),
      isActive: true,
    };

    supplier.products.push(product);
    supplier.updatedAt = new Date().toISOString();

    addTimelineEvent(supplierId, {
      type: "product_added",
      title: "Product added",
      description: `${input.productName} was added to the supplier's product list.`,
    });

    return supplier;
  },

  async deleteSupplier(id: string): Promise<void> {
    await delay();

    const supplier = suppliers.find((item) => item.id === id);

    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    if (
      supplier.paymentSummary.outstandingBalance > 0 ||
      supplier.products.length > 0
    ) {
      throw new Error(
        "This supplier cannot be deleted while products or outstanding balances remain.",
      );
    }

    suppliers = suppliers.filter((item) => item.id !== id);
    delete timeline[id];
  },
};