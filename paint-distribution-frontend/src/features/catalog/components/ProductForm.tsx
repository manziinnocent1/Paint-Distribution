import { useEffect, useState } from "react";

import type {
  Brand,
  Category,
  ProductFormValues,
} from "../types/catalog.types";

import { validateProduct } from "../schemas/catalog.schema";

interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>;
  categories: Category[];
  brands: Brand[];
  onSubmit: (values: ProductFormValues) => Promise<void>;
  submitLabel?: string;
}

const DEFAULT_VALUES: ProductFormValues = {
  name: "",
  sku: "",
  description: "",
  category: "",
  brand: "",
  base_price: 0,
  cost_price: null,
  is_active: true,
  is_perishable: false,
  requires_refrigeration: false,
};

export default function ProductForm({
  initialValues,
  categories,
  brands,
  onSubmit,
  submitLabel = "Save product",
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
    brand: initialValues?.brand ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setValues({
      ...DEFAULT_VALUES,
      ...initialValues,
      brand: initialValues?.brand ?? "",
    });
  }, [initialValues]);

  const update = <K extends keyof ProductFormValues>(
    field: K,
    value: ProductFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validation = validateProduct(values);
    setErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);
      await onSubmit(values);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Unable to save product.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-5 text-base font-semibold text-gray-900">
          Basic product information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Product name *
            </label>
            <input
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              className={fieldClass}
              placeholder="e.g. Premium Interior Emulsion"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Product SKU *
            </label>
            <input
              value={values.sku}
              onChange={(event) => update("sku", event.target.value)}
              className={fieldClass}
              placeholder="e.g. PNT-INT-001"
            />
            {errors.sku && (
              <p className="mt-1 text-xs text-red-600">{errors.sku}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              value={values.category}
              onChange={(event) => update("category", event.target.value)}
              className={fieldClass}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-600">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Brand
            </label>
            <select
              value={values.brand}
              onChange={(event) => update("brand", event.target.value)}
              className={fieldClass}
            >
              <option value="">No brand selected</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              value={values.description}
              onChange={(event) => update("description", event.target.value)}
              className={fieldClass}
              placeholder="Describe the product, its intended use, and key features..."
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-5 text-base font-semibold text-gray-900">Pricing</h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Base selling price (RWF) *
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={values.base_price}
              onChange={(event) =>
                update("base_price", Number(event.target.value))
              }
              className={fieldClass}
            />
            {errors.base_price && (
              <p className="mt-1 text-xs text-red-600">{errors.base_price}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Cost price (RWF)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={values.cost_price ?? ""}
              onChange={(event) =>
                update(
                  "cost_price",
                  event.target.value === "" ? null : Number(event.target.value),
                )
              }
              className={fieldClass}
            />
            {errors.cost_price && (
              <p className="mt-1 text-xs text-red-600">{errors.cost_price}</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-5 text-base font-semibold text-gray-900">
          Product settings
        </h2>

        <div className="space-y-4">
          {[
            {
              field: "is_active" as const,
              label: "Active product",
              description: "Make this product available in the catalog.",
            },
            {
              field: "is_perishable" as const,
              label: "Perishable product",
              description: "Mark this product as having a limited shelf life.",
            },
            {
              field: "requires_refrigeration" as const,
              label: "Requires refrigeration",
              description:
                "Indicate that this product needs refrigerated storage.",
            },
          ].map((item) => (
            <label key={item.field} className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={values[item.field]}
                onChange={(event) => update(item.field, event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <span>
                <span className="block text-sm font-medium text-gray-800">
                  {item.label}
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  {item.description}
                </span>
              </span>
            </label>
          ))}

          {errors.requires_refrigeration && (
            <p className="text-xs text-red-600">
              {errors.requires_refrigeration}
            </p>
          )}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
