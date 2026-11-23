import { ExternalLink, Image as ImageIcon } from "lucide-react";

interface DeliveryProofProps {
  imageUrl?: string | null;
  recipientName?: string;
  recipientPhone?: string;
}

export function DeliveryProof({
  imageUrl,
  recipientName,
  recipientPhone,
}: DeliveryProofProps) {
  return (
    <div className="space-y-4">
      {imageUrl ? (
        <div>
          <a
            href={imageUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
          >
            <ExternalLink size={15} />
            Open proof of delivery
          </a>
          <img
            src={imageUrl}
            alt="Proof of delivery"
            loading="lazy"
            className="mt-3 max-h-72 w-full rounded-lg border border-slate-200 object-contain"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center">
          <ImageIcon size={28} className="text-slate-400" />
          <p className="mt-2 text-sm font-medium text-slate-700">
            No proof uploaded
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Proof of delivery has not been provided.
          </p>
        </div>
      )}

      {(recipientName || recipientPhone) && (
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Delivery recipient
          </p>
          {recipientName && (
            <p className="mt-2 text-sm font-medium text-slate-800">
              {recipientName}
            </p>
          )}
          {recipientPhone && (
            <p className="mt-1 text-sm text-slate-600">{recipientPhone}</p>
          )}
        </div>
      )}
    </div>
  );
}
