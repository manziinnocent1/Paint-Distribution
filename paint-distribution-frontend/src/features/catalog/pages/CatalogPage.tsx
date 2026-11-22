import { Link } from "react-router-dom";
import { ArrowRight, Boxes, FolderTree, Package, Tag } from "lucide-react";

import CatalogSummary from "../components/CatalogSummary";

import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useBrands } from "../hooks/useBrands";

import type { CatalogSummary as CatalogSummaryType } from "../types/catalog.types";

export default function CatalogPage() {
  const { data: productsData, loading: productsLoading } = useProducts({
    page: 1,
    page_size: 100,
  });

  const { data: categoriesData, loading: categoriesLoading } = useCategories({
    page: 1,
    page_size: 100,
  });

  const { data: brandsData, loading: brandsLoading } = useBrands({
    page: 1,
    page_size: 100,
  });

  const products = productsData?.results ?? [];
  const categories = categoriesData?.results ?? [];
  const brands = brandsData?.results ?? [];

  const summary: CatalogSummaryType = {
    total_products: productsData?.count ?? 0,
    active_products: products.filter((item) => item.is_active).length,
    inactive_products: products.filter((item) => !item.is_active).length,
    total_categories: categoriesData?.count ?? 0,
    total_brands: brandsData?.count ?? 0,
    total_variants: products.reduce(
      (total, product) => total + (product.variants?.length ?? 0),
      0,
    ),
  };

  const loading = productsLoading || categoriesLoading || brandsLoading;

  const sections = [
    {
      title: "Products",
      description: "Create, update, and manage your paint products.",
      count: summary.total_products,
      icon: <Package size={22} />,
      to: "/catalog/products",
    },
    {
      title: "Categories",
      description: "Organize products into meaningful categories.",
      count: summary.total_categories,
      icon: <FolderTree size={22} />,
      to: "/catalog/categories",
    },
    {
      title: "Brands",
      description: "Manage manufacturers and product brands.",
      count: summary.total_brands,
      icon: <Tag size={22} />,
      to: "/catalog/brands",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage the products, brands, categories, and variants in your catalog.
        </p>
      </div>

      <CatalogSummary summary={summary} loading={loading} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.title}
            to={section.to}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                {section.icon}
              </div>
              <ArrowRight
                size={18}
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              {section.title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{section.description}</p>
            <p className="mt-4 text-sm font-semibold text-gray-800">
              {loading ? "Loading..." : `${section.count} records`}
            </p>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
            <Boxes size={22} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Product variants</h2>
            <p className="text-sm text-gray-500">
              Manage different sizes, packaging options, and prices within each
              product.
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Open an individual product to review its variants.
        </p>
      </div>
    </div>
  );
}
