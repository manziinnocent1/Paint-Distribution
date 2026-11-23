import { Link } from "react-router-dom";
import { CalendarDays, Package, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProcurementRequest } from "../types/procurement.types";
import { formatProcurementCurrency } from "../utils/procurement.utils";
import {
  ProcurementPriorityBadge,
  ProcurementStatusBadge,
} from "./ProcurementStatusBadge";

export function ProcurementCard({ request }: { request: ProcurementRequest }) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">
              {request.requestNumber}
            </p>
            <CardTitle className="mt-1 text-lg">{request.title}</CardTitle>
          </div>
          <ProcurementStatusBadge status={request.status} />
        </div>
        <ProcurementPriorityBadge priority={request.priority} />
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          {request.requestedBy} · {request.department}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          {request.items.length} line items
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          Required by {request.requiredDate}
        </div>

        <div className="border-t pt-3">
          <p className="text-sm text-muted-foreground">Estimated total</p>
          <p className="text-xl font-bold">
            {formatProcurementCurrency(request.estimatedTotal)}
          </p>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link to={`/procurement/${request.id}`}>View request</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
