import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import CategoryForm from "../components/CategoryForm";
import { catalogService } from "../services/catalogService";

import type { Category, CategoryFormValues } from "../types/catalog.types";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const [categoryResult, categoriesResult] = await Promise.all([
          catalogService.getCategory(id),
          catalogService.getAllCategories(),
        ]);

        setCategory(categoryResult);
        setCategories(categoriesResult);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Unable to load category.",
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const handleUpdate = async (values: CategoryFormValues) => {
    if (!id) return;

    await catalogService.updateCategory(id, values);
    navigate("/catalog/categories");
  };

  if (loading) {
    return <div className="h-48 animate-pulse rounded-xl bg-gray-100" />;
  }

  if (error || !category) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error ?? "Category not found."}
      </div>
    );
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

        <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
      </div>

      <CategoryForm
        categories={categories}
        currentCategoryId={category.id}
        initialValues={{
          name: category.name,
          description: category.description ?? "",
          parent: category.parent ?? "",
          is_active: category.is_active,
        }}
        onSubmit={handleUpdate}
        submitLabel="Update category"
      />
    </div>
  );
}
