import { useState, type FormEvent } from "react";
import {
  DELIVERY_STATUSES,
  DELIVERY_STATUS_TRANSITIONS,
} from "../../constants/delivery.constants";
import type {
  DeliveryStatus,
  DeliveryStatusFormValues,
} from "../../types/delivery.types";

interface DeliveryStatusFormProps {
  currentStatus: DeliveryStatus;
  onSubmit: (values: DeliveryStatusFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function DeliveryStatusForm({
  currentStatus,
  onSubmit,
  isSubmitting = false,
}: DeliveryStatusFormProps) {
  const options = DELIVERY_STATUS_TRANSITIONS[currentStatus];

  const [status, setStatus] = useState<DeliveryStatus | "">("");
  const [note, setNote] = useState("");
  const [failureReason, setFailureReason] = useState("");

  const isFailed = status === "FAILED";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!status) return;

    await onSubmit({
      status,
      note,
      failureReason: isFailed ? failureReason : undefined,
    });

    setStatus("");
    setNote("");
    setFailureReason("");
  };

  if (options.length === 0) {
    return (
      <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
        This delivery has no available status transitions.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-1.5 text-sm font-medium text-slate-700">
        New status
        <select
          required
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as DeliveryStatus | "")
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
        >
          <option value="">Select new status</option>
          {DELIVERY_STATUSES.filter((option) =>
            options.includes(option.value),
          ).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {isFailed && (
        <label className="block space-y-1.5 text-sm font-medium text-slate-700">
          Failure reason *
          <textarea
            required
            rows={3}
            value={failureReason}
            onChange={(event) => setFailureReason(event.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
          />
        </label>
      )}

      <label className="block space-y-1.5 text-sm font-medium text-slate-700">
        Status note
        <textarea
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Add an update about this delivery..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-blue-500"
        />
      </label>

      <button
        type="submit"
        disabled={
          !status || isSubmitting || (isFailed && !failureReason.trim())
        }
        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Updating..." : "Update delivery status"}
      </button>
    </form>
  );
}
