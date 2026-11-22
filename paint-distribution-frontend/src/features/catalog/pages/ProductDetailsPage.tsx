import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Edit, RefreshCw } from "lucide-react";

import ProductStatusBadge from "../components/ProductStatusBadge";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductVariantTable from "../components/ProductVariantTable";

import { useProductDetails } from "../hooks/useProductDetails";
import { useProductVariants } from "../hooks/useProductVariants";

import {
  formatCatalogCurrency,
  formatCatalogDate,
  formatProductUnit,
} from "../utils/catalog.utils";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { product, loading, error, refresh } = useProductDetails(id);

  const { variants, loading: variantsLoading } = useProductVariants(id);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-28 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">Unable to load product</h2>
        <p className="mt-2 text-sm text-red-700">
          {error ?? "Product not found."}
        </p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="mt-4 text-sm font-semibold text-red-700 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const details = [
    ["SKU", product.sku],
    ["Category", product.category_name ?? "—"],
    ["Brand", product.brand_name ?? "—"],
    ["Base price", formatCatalogCurrency(product.base_price)],
    [
      "Cost price",
      product.cost_price == null
        ? "—"
        : formatCatalogCurrency(product.cost_price),
    ],
    ["Created", formatCatalogDate(product.created_at)],
    ["Last updated", formatCatalogDate(product.updated_at)],
    ["Perishable", product.is_perishable ? "Yes" : "No"],
    ["Requires refrigeration", product.requires_refrigeration ? "Yes" : "No"],
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/catalog/products"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to products
        </Link>

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {product.name}
              </h1>
              <ProductStatusBadge
                status={
                  product.status ?? (product.is_active ? "active" : "inactive")
                }
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Product details and packaging variants.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void refresh()}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <Link
              to={`/catalog/products/${product.id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Edit size={16} />
              Edit product
            </Link>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProductImageGallery images={product.images ?? []} />

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Product information
          </h2>

          <p className="mb-5 text-sm leading-6 text-gray-600">
            {product.description || "No product description provided."}
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div key={label}>
                <p className="text-xs font-medium uppercase text-gray-500">
                  {label}
                </p>
                <p className="mt-1 break-words text-sm font-medium text-gray-900">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Product variants
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Packaging sizes and variant-level pricing.
          </p>
        </div>

        <ProductVariantTable
          productId={product.id}
          variants={variants.length ? variants : (product.variants ?? [])}
          loading={variantsLoading}
        />

        {product.attributes && product.attributes.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-4 font-semibold text-gray-900">
              Product attributes
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {product.attributes.map((attribute, index) => (
                <div key={attribute.id ?? `${attribute.name}-${index}`}>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    {attribute.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {attribute.values.map((item) => item.value).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {variants.length > 0 && (
          <p className="text-xs text-gray-500">
            Variant size units are displayed as{" "}
            {formatProductUnit(variants[0].unit)} where applicable.
          </p>
        )}
      </section>
    </div>
  );
}
