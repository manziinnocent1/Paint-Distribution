import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ProductForm from "../components/ProductForm";

import { useCategories } from "../hooks/useCategories";
import { useBrands } from "../hooks/useBrands";
import { catalogService } from "../services/catalogService";

import type { ProductFormValues } from "../types/catalog.types";

export default function CreateProductPage() {
  const navigate = useNavigate();

  const { allCategories, loading: categoriesLoading } = useCategories({
    page: 1,
    page_size: 100,
  });

  const { allBrands, loading: brandsLoading } = useBrands({
    page: 1,
    page_size: 100,
  });

  const handleCreate = async (values: ProductFormValues) => {
    const product = await catalogService.createProduct({
      ...values,
      brand: values.brand || "",
    });

    navigate(`/catalog/products/${product.id}`);
  };

  if (categoriesLoading || brandsLoading) {
    return <div className="h-48 animate-pulse rounded-xl bg-gray-100" />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link
          to="/catalog/products"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to products
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">Create Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new product to your distribution catalog.
        </p>
      </div>

      <ProductForm
        categories={allCategories}
        brands={allBrands}
        onSubmit={handleCreate}
        submitLabel="Create product"
      />
    </div>
  );
}
