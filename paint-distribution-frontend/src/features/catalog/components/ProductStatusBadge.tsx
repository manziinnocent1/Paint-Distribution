import type { ProductStatus } from "../types/catalog.types";

interface ProductStatusBadgeProps {
  status: ProductStatus | string;
}

const styles: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  draft: "bg-yellow-50 text-yellow-700",
};

export default function ProductStatusBadge({
  status,
}: ProductStatusBadgeProps) {
  const normalized = status.toLowerCase();

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[normalized] ?? styles.inactive
      }`}
    >
      {normalized.charAt(0).toUpperCase() + normalized.slice(1)}
    </span>
  );
}
