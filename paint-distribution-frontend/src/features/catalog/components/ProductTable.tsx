import { Link } from "react-router-dom";
import { Eye, Package } from "lucide-react";

import type { Product } from "../types/catalog.types";

import ProductStatusBadge from "./ProductStatusBadge";

import {
  formatCatalogCurrency,
  formatCatalogDate,
  getProductImage,
} from "../utils/catalog.utils";

interface ProductTableProps {
  products: Product[];
  loading?: boolean;
}

export default function ProductTable({
  products,
  loading = false,
}: ProductTableProps) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse border-b border-gray-100 bg-gray-50"
          />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <Package className="mx-auto text-gray-400" size={32} />
        <h3 className="mt-3 font-semibold text-gray-900">No products found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Add a product or adjust your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-4 font-medium">Product</th>
              <th className="px-5 py-4 font-medium">SKU</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Brand</th>
              <th className="px-5 py-4 font-medium">Base price</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Created</th>
              <th className="px-5 py-4 text-right font-medium">Details</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {products.map((product) => {
              const image = getProductImage(product.images);

              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-3">
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                          <Package size={19} />
                        </div>
                      )}

                      <span className="font-medium text-gray-900">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                    {product.sku}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                    {product.category_name ?? "—"}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                    {product.brand_name ?? "—"}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                    {formatCatalogCurrency(product.base_price)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <ProductStatusBadge
                      status={
                        product.status ??
                        (product.is_active ? "active" : "inactive")
                      }
                    />
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                    {formatCatalogDate(product.created_at)}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      to={`/catalog/products/${product.id}`}
                      aria-label={`View ${product.name}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <Eye size={14} />
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
