import { Link } from "react-router-dom";
import { Eye, Package } from "lucide-react";

import type { ProductVariant } from "../types/catalog.types";

import {
  formatCatalogCurrency,
  formatProductUnit,
} from "../utils/catalog.utils";

interface ProductVariantTableProps {
  variants: ProductVariant[];
  productId: string;
  loading?: boolean;
}

export default function ProductVariantTable({
  variants,
  productId,
  loading = false,
}: ProductVariantTableProps) {
  if (loading) {
    return <div className="h-40 animate-pulse rounded-xl bg-gray-100" />;
  }

  if (!variants.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <Package className="mx-auto text-gray-400" size={28} />
        <p className="mt-2 text-sm text-gray-500">
          No variants have been added to this product.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Variant</th>
              <th className="px-5 py-3 font-medium">SKU</th>
              <th className="px-5 py-3 font-medium">Size</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {variants.map((variant) => (
              <tr key={variant.id}>
                <td className="px-5 py-4 font-medium text-gray-900">
                  {variant.name}
                </td>
                <td className="px-5 py-4 text-gray-600">{variant.sku}</td>
                <td className="px-5 py-4 text-gray-600">
                  {variant.size
                    ? `${variant.size} ${formatProductUnit(variant.unit)}`
                    : "—"}
                </td>
                <td className="px-5 py-4 font-medium text-gray-900">
                  {formatCatalogCurrency(variant.price)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      variant.is_active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {variant.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    to={`/catalog/products/${productId}/variants/${variant.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    <Eye size={14} />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
