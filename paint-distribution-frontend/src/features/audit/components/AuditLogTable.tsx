import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

import type { AuditLog } from "../types/audit.types";

import AuditActionBadge from "./AuditActionBadge";
import AuditEntityBadge from "./AuditEntityBadge";

import { formatAuditDate, getActorName } from "../utils/audit.utils";

interface AuditTableProps {
  logs: AuditLog[];
  loading?: boolean;
}

export default function AuditTable({ logs, loading = false }: AuditTableProps) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse border-b border-gray-100 bg-gray-50 last:border-b-0"
          />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
          <Eye size={22} />
        </div>

        <h3 className="mt-4 text-base font-semibold text-gray-900">
          No audit records found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Try changing your search terms or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="whitespace-nowrap px-5 py-4 font-medium">User</th>

              <th className="whitespace-nowrap px-5 py-4 font-medium">
                Action
              </th>

              <th className="whitespace-nowrap px-5 py-4 font-medium">
                Entity
              </th>

              <th className="min-w-64 px-5 py-4 font-medium">Description</th>

              <th className="whitespace-nowrap px-5 py-4 font-medium">
                IP address
              </th>

              <th className="whitespace-nowrap px-5 py-4 font-medium">
                Date and time
              </th>

              <th className="px-5 py-4 text-right font-medium">Details</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log.id} className="transition-colors hover:bg-gray-50">
                <td className="whitespace-nowrap px-5 py-4">
                  <p className="font-medium text-gray-900">
                    {getActorName(log.actor)}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {log.actor?.email ?? "System event"}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <AuditActionBadge action={log.action} />
                </td>

                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <AuditEntityBadge entity={log.entity_type} />

                    {log.entity_name && (
                      <p className="max-w-36 truncate text-xs text-gray-500">
                        {log.entity_name}
                      </p>
                    )}
                  </div>
                </td>

                <td className="max-w-80 px-5 py-4 text-gray-600">
                  <p className="line-clamp-2">{log.description}</p>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                  {log.ip_address || "—"}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                  {formatAuditDate(log.created_at)}
                </td>

                <td className="px-5 py-4 text-right">
                  <Link
                    to={`/audit/${log.id}`}
                    aria-label={`View audit record ${log.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <Eye size={14} />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
