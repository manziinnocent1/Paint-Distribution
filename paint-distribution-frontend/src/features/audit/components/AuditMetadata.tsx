interface AuditMetadataProps {
  metadata?: Record<string, unknown> | null;
  changes?: Record<string, unknown> | null;
}

function formatValue(value: unknown): string {
  if (value === null) {
    return "null";
  }

  if (value === undefined) {
    return "Not provided";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function JsonSection({
  title,
  data,
}: {
  title: string;
  data?: Record<string, unknown> | null;
}) {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-gray-900">{title}</h4>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        {Object.entries(data).map(([key, value]) => (
          <div
            key={key}
            className="grid grid-cols-1 gap-2 border-b border-gray-100 p-3 last:border-b-0 sm:grid-cols-3"
          >
            <p className="break-words text-sm font-medium text-gray-600">
              {key.replaceAll("_", " ")}
            </p>

            <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs text-gray-800 sm:col-span-2">
              {formatValue(value)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AuditMetadata({
  metadata,
  changes,
}: AuditMetadataProps) {
  if (
    (!metadata || Object.keys(metadata).length === 0) &&
    (!changes || Object.keys(changes).length === 0)
  ) {
    return (
      <p className="text-sm text-gray-500">
        No additional metadata or change information was recorded.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <JsonSection title="Recorded changes" data={changes} />
      <JsonSection title="Additional metadata" data={metadata} />
    </div>
  );
}
