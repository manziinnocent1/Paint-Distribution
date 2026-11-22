import { Boxes, FolderTree, Package, Tag } from "lucide-react";

import type { CatalogSummary as CatalogSummaryType } from "../types/catalog.types";

interface CatalogSummaryProps {
  summary: CatalogSummaryType;
  loading?: boolean;
}

export default function CatalogSummary({
  summary,
  loading = false,
}: CatalogSummaryProps) {
  const cards = [
    {
      label: "Total products",
      value: summary.total_products,
      icon: <Package size={21} />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active products",
      value: summary.active_products,
      icon: <Boxes size={21} />,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Categories",
      value: summary.total_categories,
      icon: <FolderTree size={21} />,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Brands",
      value: summary.total_brands,
      icon: <Tag size={21} />,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="h-28 animate-pulse rounded-xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <div className={`rounded-lg p-2.5 ${card.color}`}>{card.icon}</div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {new Intl.NumberFormat("en-US").format(card.value)}
          </p>
        </div>
      ))}
    </div>
  );
}
