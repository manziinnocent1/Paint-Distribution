import type {
  CreatePriceInput,
  CreatePricingRuleInput,
  PriceAdjustmentInput,
  PriceHistory,
  PriceList,
  ProductPrice,
  PricingFilters,
  PricingListResponse,
  PricingRule,
  PricingStats,
  UpdatePriceInput,
} from "../types/pricing.types";
import { calculateDiscountPercentage, getPriceStatus } from "../utils/pricing.utils";

const now = new Date();

const daysAgo = (days: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

let prices: ProductPrice[] = [
  {
    id: "price-001",
    productId: "product-001",
    productName: "Weather Shield Exterior Paint",
    productSku: "WS-EXT-20L",
    variantId: "variant-001",
    variantName: "20 Litre White",
    priceListId: "list-retail",
    priceListName: "Standard Retail",
    priceType: "retail",
    status: "active",
    currency: "RWF",
    basePrice: 95000,
    sellingPrice: 95000,
    effectiveFrom: daysAgo(30),
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
  },
  {
    id: "price-002",
    productId: "product-002",
    productName: "Premium Interior Emulsion",
    productSku: "PIE-INT-20L",
    variantId: "variant-002",
    variantName: "20 Litre Cream",
    priceListId: "list-wholesale",
    priceListName: "Wholesale Customers",
    priceType: "wholesale",
    status: "active",
    currency: "RWF",
    basePrice: 85000,
    sellingPrice: 79000,
    discountPercentage: calculateDiscountPercentage(85000, 79000),
    effectiveFrom: daysAgo(20),
    createdAt: daysAgo(20),
    updatedAt: daysAgo(20),
  },
  {
    id: "price-003",
    productId: "product-003",
    productName: "Acrylic Primer",
    productSku: "ACP-PRM-5L",
    variantId: "variant-003",
    variantName: "5 Litre",
    priceType: "promotional",
    status: "active",
    currency: "RWF",
    basePrice: 42000,
    sellingPrice: 36000,
    discountPercentage: calculateDiscountPercentage(42000, 36000),
    effectiveFrom: daysAgo(5),
    effectiveTo: daysAgo(-10),
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    id: "price-004",
    productId: "product-004",
    productName: "Wood Finish Varnish",
    productSku: "WF-VAR-1L",
    variantId: "variant-004",
    variantName: "1 Litre Clear",
    priceType: "retail",
    status: "scheduled",
    currency: "RWF",
    basePrice: 18000,
    sellingPrice: 19500,
    effectiveFrom: daysAgo(-7),
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
];

let history: PriceHistory[] = [
  {
    id: "history-001",
    priceId: "price-001",
    previousPrice: 90000,
    newPrice: 95000,
    currency: "RWF",
    reason: "Supplier cost adjustment",
    changedBy: "System Admin",
    changedAt: daysAgo(30),
  },
  {
    id: "history-002",
    priceId: "price-002",
    previousPrice: 85000,
    newPrice: 79000,
    currency: "RWF",
    reason: "Wholesale customer pricing",
    changedBy: "Sales Manager",
    changedAt: daysAgo(20),
  },
];

let priceLists: PriceList[] = [
  {
    id: "list-retail",
    name: "Standard Retail",
    code: "RETAIL",
    description: "Default pricing for retail customers.",
    priceType: "retail",
    currency: "RWF",
    isDefault: true,
    isActive: true,
    effectiveFrom: daysAgo(90),
    createdAt: daysAgo(90),
    updatedAt: daysAgo(90),
  },
  {
    id: "list-wholesale",
    name: "Wholesale Customers",
    code: "WHOLESALE",
    description: "Discounted pricing for wholesale customers.",
    priceType: "wholesale",
    currency: "RWF",
    customerGroup: "Wholesale",
    isDefault: false,
    isActive: true,
    effectiveFrom: daysAgo(60),
    createdAt: daysAgo(60),
    updatedAt: daysAgo(60),
  },
];

let pricingRules: PricingRule[] = [
  {
    id: "rule-001",
    name: "Wholesale discount",
    description: "Discount for qualifying wholesale purchases.",
    type: "percentage_discount",
    value: 7,
    minimumQuantity: 10,
    startsAt: daysAgo(30),
    isActive: true,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
  },
];

const wait = (ms = 200) =>
  new Promise((resolve) => setTimeout(resolve, ms));

class PricingService {
  async getAll(
    filters: PricingFilters = {},
    page = 1,
    pageSize = 10,
  ): Promise<PricingListResponse> {
    await wait();

    let result = [...prices];

    if (filters.search?.trim()) {
      const term = filters.search.toLowerCase();

      result = result.filter((price) =>
        [
          price.productName,
          price.productSku,
          price.variantName,
          price.priceListName,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(term)),
      );
    }

    if (filters.priceType && filters.priceType !== "all") {
      result = result.filter(
        (price) => price.priceType === filters.priceType,
      );
    }

    if (filters.status && filters.status !== "all") {
      result = result.filter((price) => price.status === filters.status);
    }

    if (filters.priceListId) {
      result = result.filter(
        (price) => price.priceListId === filters.priceListId,
      );
    }

    if (filters.currency) {
      result = result.filter(
        (price) => price.currency === filters.currency,
      );
    }

    if (filters.minPrice !== undefined) {
      result = result.filter(
        (price) => price.sellingPrice >= filters.minPrice!,
      );
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter(
        (price) => price.sellingPrice <= filters.maxPrice!,
      );
    }

    result.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime(),
    );

    const count = result.length;
    const offset = (page - 1) * pageSize;

    return {
      results: result.slice(offset, offset + pageSize),
      count,
      page,
      pageSize,
    };
  }

  async getById(id: string): Promise<ProductPrice> {
    await wait();

    const price = prices.find((item) => item.id === id);

    if (!price) throw new Error("Price record not found.");

    return { ...price };
  }

  async getStats(): Promise<PricingStats> {
    await wait();

    const active = prices.filter((price) => price.status === "active");
    const discounted = prices.filter(
      (price) => price.sellingPrice < price.basePrice,
    );

    return {
      totalPrices: prices.length,
      activePrices: active.length,
      scheduledPrices: prices.filter(
        (price) => price.status === "scheduled",
      ).length,
      expiredPrices: prices.filter(
        (price) => price.status === "expired",
      ).length,
      averageSellingPrice:
        prices.length > 0
          ? prices.reduce((sum, price) => sum + price.sellingPrice, 0) /
            prices.length
          : 0,
      totalDiscounts: discounted.reduce(
        (sum, price) => sum + price.basePrice - price.sellingPrice,
        0,
      ),
    };
  }

  async create(input: CreatePriceInput): Promise<ProductPrice> {
    await wait();

    const timestamp = new Date().toISOString();

    const price: ProductPrice = {
      ...input,
      id: crypto.randomUUID(),
      status: getPriceStatus(input.effectiveFrom, input.effectiveTo),
      discountPercentage: calculateDiscountPercentage(
        input.basePrice,
        input.sellingPrice,
      ),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    prices = [price, ...prices];

    history = [
      {
        id: crypto.randomUUID(),
        priceId: price.id,
        previousPrice: 0,
        newPrice: price.sellingPrice,
        currency: price.currency,
        reason: "Initial price created",
        changedBy: "Current User",
        changedAt: timestamp,
      },
      ...history,
    ];

    return { ...price };
  }

  async update(
    id: string,
    input: UpdatePriceInput,
  ): Promise<ProductPrice> {
    await wait();

    const index = prices.findIndex((item) => item.id === id);

    if (index === -1) throw new Error("Price record not found.");

    const current = prices[index];
    const updated: ProductPrice = {
      ...current,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    if (input.effectiveFrom || input.effectiveTo !== undefined) {
      updated.status = getPriceStatus(
        updated.effectiveFrom,
        updated.effectiveTo,
      );
    }

    updated.discountPercentage = calculateDiscountPercentage(
      updated.basePrice,
      updated.sellingPrice,
    );

    if (current.sellingPrice !== updated.sellingPrice) {
      history = [
        {
          id: crypto.randomUUID(),
          priceId: id,
          previousPrice: current.sellingPrice,
          newPrice: updated.sellingPrice,
          currency: updated.currency,
          reason: "Price updated",
          changedBy: "Current User",
          changedAt: updated.updatedAt,
        },
        ...history,
      ];
    }

    prices[index] = updated;

    return { ...updated };
  }

  async getHistory(priceId: string): Promise<PriceHistory[]> {
    await wait();

    return history
      .filter((item) => item.priceId === priceId)
      .sort(
        (a, b) =>
          new Date(b.changedAt).getTime() -
          new Date(a.changedAt).getTime(),
      );
  }

  async adjust(
    priceId: string,
    input: PriceAdjustmentInput,
  ): Promise<ProductPrice> {
    await wait();

    const index = prices.findIndex((item) => item.id === priceId);

    if (index === -1) throw new Error("Price record not found.");

    const current = prices[index];

    const adjustment =
      input.adjustmentType === "percentage"
        ? current.sellingPrice * (input.adjustmentValue / 100)
        : input.adjustmentValue;

    const newPrice = Number(
      (
        input.adjustmentType === "percentage"
          ? current.sellingPrice + adjustment
          : current.sellingPrice + adjustment
      ).toFixed(2),
    );

    const updated: ProductPrice = {
      ...current,
      sellingPrice: newPrice,
      discountPercentage: calculateDiscountPercentage(
        current.basePrice,
        newPrice,
      ),
      updatedAt: new Date().toISOString(),
    };

    if (updated.minimumPrice !== undefined && newPrice < updated.minimumPrice) {
      throw new Error("The adjusted price would be below the minimum price.");
    }

    if (updated.maximumPrice !== undefined && newPrice > updated.maximumPrice) {
      throw new Error("The adjusted price would exceed the maximum price.");
    }

    history = [
      {
        id: crypto.randomUUID(),
        priceId,
        previousPrice: current.sellingPrice,
        newPrice,
        currency: current.currency,
        reason: input.reason,
        changedBy: "Current User",
        changedAt: updated.updatedAt,
      },
      ...history,
    ];

    prices[index] = updated;

    return { ...updated };
  }

  async getPriceLists(): Promise<PriceList[]> {
    await wait();
    return priceLists.map((item) => ({ ...item }));
  }

  async createPriceList(
    input: Omit<
      PriceList,
      "id" | "createdAt" | "updatedAt" | "isActive"
    >,
  ): Promise<PriceList> {
    await wait();

    const timestamp = new Date().toISOString();

    const list: PriceList = {
      ...input,
      id: crypto.randomUUID(),
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    if (list.isDefault) {
      priceLists = priceLists.map((item) => ({
        ...item,
        isDefault: false,
      }));
    }

    priceLists = [list, ...priceLists];

    return { ...list };
  }

  async getRules(): Promise<PricingRule[]> {
    await wait();
    return pricingRules.map((item) => ({ ...item }));
  }

  async createRule(input: CreatePricingRuleInput): Promise<PricingRule> {
    await wait();

    const timestamp = new Date().toISOString();

    const rule: PricingRule = {
      ...input,
      id: crypto.randomUUID(),
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    pricingRules = [rule, ...pricingRules];

    return { ...rule };
  }
}

export const pricingService = new PricingService();