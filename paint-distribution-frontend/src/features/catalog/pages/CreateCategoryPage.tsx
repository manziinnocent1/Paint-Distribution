import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import CategoryForm from "../components/CategoryForm";
import { useCategories } from "../hooks/useCategories";

import type { CategoryFormValues } from "../types/catalog.types";

export default function CreateCategoryPage() {
  const navigate = useNavigate();

  const { allCategories, loading, createCategory } = useCategories({
    page: 1,
    page_size: 100,
  });

  const handleCreate = async (values: CategoryFormValues) => {
    await createCategory(values);
    navigate("/catalog/categories");
  };

  if (loading) {
    return <div className="h-48 animate-pulse rounded-xl bg-gray-100" />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to="/catalog/categories"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to categories
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">Create Category</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a category for organizing products.
        </p>
      </div>

      <CategoryForm
        categories={allCategories}
        onSubmit={handleCreate}
        submitLabel="Create category"
      />
    </div>
  );
}
