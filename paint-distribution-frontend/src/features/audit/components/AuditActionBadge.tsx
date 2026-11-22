import { formatAuditAction, getActionColor } from "../utils/audit.utils";

interface AuditActionBadgeProps {
  action: string;
}

export default function AuditActionBadge({ action }: AuditActionBadgeProps) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${getActionColor(action)}`}
    >
      {formatAuditAction(action)}
    </span>
  );
}
