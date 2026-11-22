import { useState } from "react";

import type {
  ProductUnit,
  ProductVariantFormValues,
} from "../types/catalog.types";

import { validateProductVariant } from "../schemas/catalog.schema";

interface ProductVariantFormProps {
  onSubmit: (values: ProductVariantFormValues) => Promise<void>;
}

const initialValues: ProductVariantFormValues = {
  name: "",
  sku: "",
  size: null,
  unit: "litre",
  price: 0,
  cost_price: null,
  barcode: "",
  is_active: true,
};

export default function ProductVariantForm({
  onSubmit,
}: ProductVariantFormProps) {
  const [values, setValues] = useState<ProductVariantFormValues>(initialValues);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = <K extends keyof ProductVariantFormValues>(
    field: K,
    value: ProductVariantFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validation = validateProductVariant(values);
    setErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);
      await onSubmit(values);
      setValues(initialValues);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Unable to save variant.",
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
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-5"
    >
      <h3 className="text-base font-semibold text-gray-900">
        Add product variant
      </h3>

      {submitError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Variant name *
          </label>
          <input
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            className={fieldClass}
            placeholder="e.g. White 20 Litre"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Variant SKU *
          </label>
          <input
            value={values.sku}
            onChange={(event) => update("sku", event.target.value)}
            className={fieldClass}
            placeholder="e.g. PNT-WHT-20L"
          />
          {errors.sku && (
            <p className="mt-1 text-xs text-red-600">{errors.sku}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Size
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={values.size ?? ""}
            onChange={(event) =>
              update(
                "size",
                event.target.value === "" ? null : Number(event.target.value),
              )
            }
            className={fieldClass}
          />
          {errors.size && (
            <p className="mt-1 text-xs text-red-600">{errors.size}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Unit
          </label>
          <select
            value={values.unit}
            onChange={(event) =>
              update("unit", event.target.value as ProductUnit)
            }
            className={fieldClass}
          >
            <option value="litre">Litre</option>
            <option value="ml">Millilitre</option>
            <option value="kg">Kilogram</option>
            <option value="gram">Gram</option>
            <option value="piece">Piece</option>
            <option value="set">Set</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Selling price (RWF) *
          </label>
          <input
            type="number"
            min="0"
            value={values.price}
            onChange={(event) => update("price", Number(event.target.value))}
            className={fieldClass}
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-600">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Cost price (RWF)
          </label>
          <input
            type="number"
            min="0"
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

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Barcode
          </label>
          <input
            value={values.barcode}
            onChange={(event) => update("barcode", event.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={values.is_active}
          onChange={(event) => update("is_active", event.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600"
        />
        Active variant
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Add variant"}
        </button>
      </div>
    </form>
  );
}
