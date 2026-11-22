import { useState } from "react";

import type { BrandFormValues } from "../types/catalog.types";

import { validateBrand } from "../schemas/catalog.schema";

interface BrandFormProps {
  initialValues?: Partial<BrandFormValues>;
  onSubmit: (values: BrandFormValues) => Promise<void>;
  submitLabel?: string;
}

export default function BrandForm({
  initialValues,
  onSubmit,
  submitLabel = "Save brand",
}: BrandFormProps) {
  const [values, setValues] = useState<BrandFormValues>({
    name: initialValues?.name ?? "",
    description: initialValues?.description ?? "",
    website: initialValues?.website ?? "",
    is_active: initialValues?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validation = validateBrand(values);
    setErrors(validation.errors);

    if (!validation.isValid) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      await onSubmit(values);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Unable to save brand.",
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
          Brand name *
        </label>
        <input
          value={values.name}
          onChange={(event) =>
            setValues({ ...values, name: event.target.value })
          }
          className={fieldClass}
          placeholder="e.g. Example Paints"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Website
        </label>
        <input
          type="url"
          value={values.website}
          onChange={(event) =>
            setValues({ ...values, website: event.target.value })
          }
          className={fieldClass}
          placeholder="https://example.com"
        />
        {errors.website && (
          <p className="mt-1 text-xs text-red-600">{errors.website}</p>
        )}
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
          placeholder="Describe this brand..."
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
        Active brand
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
