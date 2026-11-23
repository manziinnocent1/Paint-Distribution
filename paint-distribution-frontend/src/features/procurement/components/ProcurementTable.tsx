import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ProcurementRequest } from "../types/procurement.types";
import { formatProcurementCurrency } from "../utils/procurement.utils";
import {
  ProcurementPriorityBadge,
  ProcurementStatusBadge,
} from "./ProcurementStatusBadge";

export function ProcurementTable({
  requests,
}: {
  requests: ProcurementRequest[];
}) {
  if (!requests.length) {
    return (
      <div className="rounded-lg border p-10 text-center text-muted-foreground">
        No procurement requests found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Requested by</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Estimated total</TableHead>
            <TableHead>Required date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="font-medium">{request.requestNumber}</div>
                <div className="text-sm text-muted-foreground">
                  {request.title}
                </div>
              </TableCell>
              <TableCell>{request.department}</TableCell>
              <TableCell>{request.requestedBy}</TableCell>
              <TableCell>
                <ProcurementPriorityBadge priority={request.priority} />
              </TableCell>
              <TableCell>
                <ProcurementStatusBadge status={request.status} />
              </TableCell>
              <TableCell>
                {formatProcurementCurrency(request.estimatedTotal)}
              </TableCell>
              <TableCell>{request.requiredDate}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button asChild variant="ghost" size="icon">
                    <Link to={`/procurement/${request.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>

                  {["draft", "rejected"].includes(request.status) && (
                    <Button asChild variant="ghost" size="icon">
                      <Link to={`/procurement/${request.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
