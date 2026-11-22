import type {
  ProductStatus,
} from "../types/catalog.types";

export const formatCatalogCurrency = (
  amount: number,
  currency = "RWF",
): string => {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCatalogDate = (date?: string): string => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-RW", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

export const getProductStatus = (
  product: {
    status?: string;
    is_active: boolean;
  },
): ProductStatus => {
  if (product.status === "draft") {
    return "draft";
  }

  return product.is_active ? "active" : "inactive";
};

export const formatProductUnit = (unit?: string | null): string => {
  if (!unit) {
    return "";
  }

  const labels: Record<string, string> = {
    litre: "L",
    ml: "ml",
    kg: "kg",
    gram: "g",
    piece: "Piece",
    set: "Set",
  };

  return labels[unit] ?? unit;
};

export const getProductImage = (
  images?: { image: string; is_primary?: boolean }[],
): string | null => {
  if (!images?.length) {
    return null;
  }

  return (
    images.find((image) => image.is_primary)?.image ??
    images[0].image
  );
};

export const getProductDisplayName = (
  product: {
    name: string;
    sku?: string;
  },
): string => {
  return product.sku
    ? `${product.name} (${product.sku})`
    : product.name;
};