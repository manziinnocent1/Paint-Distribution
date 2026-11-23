import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProcurementRequest } from "../types/procurement.types";
import { formatProcurementCurrency } from "../utils/procurement.utils";
import {
  ProcurementPriorityBadge,
  ProcurementStatusBadge,
} from "./ProcurementStatusBadge";
import { ProcurementItemsTable } from "./ProcurementItemsTable";
import { ProcurementApproval } from "./ProcurementApproval";

export function ProcurementDetails({
  request,
}: {
  request: ProcurementRequest;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" asChild>
          <Link to="/procurement">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to procurement
          </Link>
        </Button>

        {["draft", "rejected"].includes(request.status) && (
          <Button asChild>
            <Link to={`/procurement/${request.id}/edit`}>Edit request</Link>
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {request.requestNumber}
          </p>
          <h1 className="mt-1 text-2xl font-bold">{request.title}</h1>
          <p className="mt-2 text-muted-foreground">{request.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <ProcurementStatusBadge status={request.status} />
          <ProcurementPriorityBadge priority={request.priority} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Request information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Requested by</p>
                <p className="mt-1 flex items-center gap-2 font-medium">
                  <User className="h-4 w-4" />
                  {request.requestedBy}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="mt-1 flex items-center gap-2 font-medium">
                  <Building2 className="h-4 w-4" />
                  {request.department}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Required date</p>
                <p className="mt-1 flex items-center gap-2 font-medium">
                  <CalendarDays className="h-4 w-4" />
                  {request.requiredDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Supplier</p>
                <p className="mt-1 font-medium">
                  {request.supplierName ?? "Not assigned"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requested items</CardTitle>
            </CardHeader>
            <CardContent>
              <ProcurementItemsTable items={request.items} />
              <div className="mt-5 flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Estimated total
                  </p>
                  <p className="text-2xl font-bold">
                    {formatProcurementCurrency(request.estimatedTotal)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {request.approvedBy && (
            <Card>
              <CardHeader>
                <CardTitle>Approval information</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>Approved by: {request.approvedBy}</p>
                <p className="mt-1 text-muted-foreground">
                  Approved on: {request.approvedAt}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <ProcurementApproval request={request} />
      </div>
    </div>
  );
}
