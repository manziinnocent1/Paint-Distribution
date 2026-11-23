import { useState, type FormEvent } from "react";
import type { Delivery, DeliveryFormValues } from "../../types/delivery.types";
import { formatDeliveryDate } from "../../utils/delivery-formatters";

interface DeliveryFormProps {
  initialValues?: Delivery;
  onSubmit: (values: DeliveryFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function DeliveryForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save delivery",
}: DeliveryFormProps) {
  const [values, setValues] = useState<DeliveryFormValues>({
    orderReference: initialValues?.orderReference ?? "",
    customerId: initialValues?.customer.id ?? "",
    addressLine1: initialValues?.address.addressLine1 ?? "",
    addressLine2: initialValues?.address.addressLine2 ?? "",
    city: initialValues?.address.city ?? "",
    district: initialValues?.address.district ?? "",
    province: initialValues?.address.province ?? "",
    country: initialValues?.address.country ?? "Rwanda",
    postalCode: initialValues?.address.postalCode ?? "",
    deliveryFee: initialValues?.deliveryFee ?? 0,
    estimatedDeliveryAt: initialValues?.estimatedDeliveryAt
      ? initialValues.estimatedDeliveryAt.slice(0, 16)
      : "",
    deliveryNotes: initialValues?.deliveryNotes ?? "",
  });

  const [error, setError] = useState("");

  const update = <K extends keyof DeliveryFormValues>(
    key: K,
    value: DeliveryFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (
      !values.orderReference.trim() ||
      !values.customerId.trim() ||
      !values.addressLine1.trim() ||
      !values.city.trim() ||
      !values.country.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!Number.isFinite(values.deliveryFee) || values.deliveryFee < 0) {
      setError("Delivery fee must be a valid non-negative amount.");
      return;
    }

    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold text-slate-900">Order information</h2>
          <p className="mt-1 text-sm text-slate-500">
            Identify the order and customer for this delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            Order reference *
            <input
              required
              value={values.orderReference}
              onChange={(event) => update("orderReference", event.target.value)}
              placeholder="ORD-2026-001"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
            />
          </label>

          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            Customer ID *
            <input
              required
              value={values.customerId}
              onChange={(event) => update("customerId", event.target.value)}
              placeholder="Customer identifier"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold text-slate-900">Delivery address</h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter the destination details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
            Address line 1 *
            <input
              required
              value={values.addressLine1}
              onChange={(event) => update("addressLine1", event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
            />
          </label>

          <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
            Address line 2
            <input
              value={values.addressLine2}
              onChange={(event) => update("addressLine2", event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
            />
          </label>

          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            City *
            <input
              required
              value={values.city}
              onChange={(event) => update("city", event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
            />
          </label>

          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            District
            <input
              value={values.district}
              onChange={(event) => update("district", event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
            />
          </label>

          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            Province
            <input
              value={values.province}
              onChange={(event) => update("province", event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
            />
          </label>

          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            Country *
            <input
              required
              value={values.country}
              onChange={(event) => update("country", event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
            />
          </label>

          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            Postal code
            <input
              value={values.postalCode}
              onChange={(event) => update("postalCode", event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold text-slate-900">
            Delivery arrangements
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Set the delivery fee and expected delivery time.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            Delivery fee (RWF) *
            <input
              type="number"
              min="0"
              step="1"
              required
              value={values.deliveryFee}
              onChange={(event) =>
                update("deliveryFee", Number(event.target.value))
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
            />
          </label>

          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            Estimated delivery
            <input
              type="datetime-local"
              value={values.estimatedDeliveryAt ?? ""}
              onChange={(event) =>
                update("estimatedDeliveryAt", event.target.value)
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
            />
          </label>
        </div>

        <label className="block space-y-1.5 text-sm font-medium text-slate-700">
          Delivery notes
          <textarea
            rows={4}
            value={values.deliveryNotes ?? ""}
            onChange={(event) => update("deliveryNotes", event.target.value)}
            placeholder="Additional instructions for the delivery team..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
          />
        </label>
      </section>

      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
