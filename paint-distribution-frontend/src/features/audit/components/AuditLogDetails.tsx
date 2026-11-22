import { Activity, Calendar, Globe, Monitor, User } from "lucide-react";

import type { AuditLog } from "../types/audit.types";

import AuditActionBadge from "./AuditActionBadge";
import AuditEntityBadge from "./AuditEntityBadge";
import AuditMetadata from "./AuditMetadata";

import {
  formatAuditDate,
  formatAuditTime,
  getActorName,
} from "../utils/audit.utils";

interface AuditDetailsProps {
  audit: AuditLog;
}

export default function AuditDetails({ audit }: AuditDetailsProps) {
  const information = [
    {
      label: "Audit ID",
      value: audit.id,
      icon: <Activity size={17} />,
    },
    {
      label: "Performed by",
      value: getActorName(audit.actor),
      icon: <User size={17} />,
    },
    {
      label: "Email address",
      value: audit.actor?.email ?? "System",
      icon: <User size={17} />,
    },
    {
      label: "IP address",
      value: audit.ip_address || "Not recorded",
      icon: <Globe size={17} />,
    },
    {
      label: "Date and time",
      value: formatAuditDate(audit.created_at),
      icon: <Calendar size={17} />,
    },
    {
      label: "Time",
      value: formatAuditTime(audit.created_at),
      icon: <Calendar size={17} />,
    },
    {
      label: "User agent",
      value: audit.user_agent || "Not recorded",
      icon: <Monitor size={17} />,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <AuditActionBadge action={audit.action} />
          <AuditEntityBadge entity={audit.entity_type} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          {audit.description}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {audit.entity_name
            ? `Affected record: ${audit.entity_name}`
            : "No affected record name was recorded."}
        </p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-5 text-base font-semibold text-gray-900">
          Event information
        </h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {information.map((item) => (
            <div key={item.label} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                {item.icon}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase text-gray-500">
                  {item.label}
                </p>

                <p className="mt-1 break-words text-sm font-medium text-gray-900">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-5 text-base font-semibold text-gray-900">
          Change details and metadata
        </h3>

        <AuditMetadata changes={audit.changes} metadata={audit.metadata} />
      </section>
    </div>
  );
}
