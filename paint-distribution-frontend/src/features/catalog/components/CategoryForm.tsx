import { useState } from "react";

import type { Category, CategoryFormValues } from "../types/catalog.types";

import { validateCategory } from "../schemas/catalog.schema";

interface CategoryFormProps {
  categories: Category[];
  initialValues?: Partial<CategoryFormValues>;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  submitLabel?: string;
  currentCategoryId?: string;
}

export default function CategoryForm({
  categories,
  initialValues,
  onSubmit,
  submitLabel = "Save category",
  currentCategoryId,
}: CategoryFormProps) {
  const [values, setValues] = useState<CategoryFormValues>({
    name: initialValues?.name ?? "",
    description: initialValues?.description ?? "",
    parent: initialValues?.parent ?? "",
    is_active: initialValues?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validation = validateCategory(values);
    setErrors(validation.errors);

    if (!validation.isValid) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      await onSubmit(values);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Unable to save category.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-gray-200 bg-white p-5"
    >
      {submitError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Category name *
        </label>
        <input
          value={values.name}
          onChange={(event) =>
            setValues({ ...values, name: event.target.value })
          }
          className={fieldClass}
          placeholder="e.g. Interior Paint"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Parent category
        </label>
        <select
          value={values.parent}
          onChange={(event) =>
            setValues({ ...values, parent: event.target.value })
          }
          className={fieldClass}
        >
          <option value="">No parent category</option>
          {categories
            .filter((category) => category.id !== currentCategoryId)
            .map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          rows={4}
          value={values.description}
          onChange={(event) =>
            setValues({ ...values, description: event.target.value })
          }
          className={fieldClass}
          placeholder="Describe this product category..."
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={values.is_active}
          onChange={(event) =>
            setValues({ ...values, is_active: event.target.checked })
          }
          className="h-4 w-4 rounded border-gray-300 text-blue-600"
        />
        Active category
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
