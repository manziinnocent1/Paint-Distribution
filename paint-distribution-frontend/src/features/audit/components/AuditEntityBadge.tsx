import { formatAuditEntity, getEntityColor } from "../utils/audit.utils";

interface AuditEntityBadgeProps {
  entity: string;
}

export default function AuditEntityBadge({ entity }: AuditEntityBadgeProps) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${getEntityColor(entity)}`}
    >
      {formatAuditEntity(entity)}
    </span>
  );
}
