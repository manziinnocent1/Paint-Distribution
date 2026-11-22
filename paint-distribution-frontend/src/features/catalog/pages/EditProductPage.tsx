import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ProductForm from "../components/ProductForm";

import { useProductDetails } from "../hooks/useProductDetails";
import { useCategories } from "../hooks/useCategories";
import { useBrands } from "../hooks/useBrands";

import type { ProductFormValues } from "../types/catalog.types";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    product,
    loading: productLoading,
    error,
    updateProduct,
  } = useProductDetails(id);

  const { allCategories, loading: categoriesLoading } = useCategories({
    page: 1,
    page_size: 100,
  });

  const { allBrands, loading: brandsLoading } = useBrands({
    page: 1,
    page_size: 100,
  });

  const handleUpdate = async (values: ProductFormValues) => {
    await updateProduct({
      ...values,
      brand: values.brand || "",
    });

    navigate(`/catalog/products/${id}`);
  };

  if (productLoading || categoriesLoading || brandsLoading) {
    return <div className="h-64 animate-pulse rounded-xl bg-gray-100" />;
  }

  if (error || !product) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error ?? "Product not found."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link
          to={`/catalog/products/${id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to product
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update the product information and settings.
        </p>
      </div>

      <ProductForm
        initialValues={{
          name: product.name,
          sku: product.sku,
          description: product.description ?? "",
          category: product.category,
          brand: product.brand ?? "",
          base_price: product.base_price,
          cost_price: product.cost_price ?? null,
          is_active: product.is_active,
          is_perishable: product.is_perishable ?? false,
          requires_refrigeration: product.requires_refrigeration ?? false,
        }}
        categories={allCategories}
        brands={allBrands}
        onSubmit={handleUpdate}
        submitLabel="Update product"
      />
    </div>
  );
}
