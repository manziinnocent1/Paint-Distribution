import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { Supplier } from "../types/supplier.types";
import {
  formatSupplierCurrency,
  getPrimarySupplierAddress,
} from "../utils/supplier.utils";

import { SupplierAvatar } from "./SupplierAvatar";
import { SupplierStatusBadge } from "./SupplierStatusBadge";
import { SupplierTypeBadge } from "./SupplierTypeBadge";

export function SupplierCard({ supplier }: { supplier: Supplier }) {
  const address = getPrimarySupplierAddress(supplier);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-3">
          <SupplierAvatar name={supplier.name} />
          <div>
            <h3 className="font-semibold">{supplier.name}</h3>
            <p className="text-sm text-muted-foreground">
              {supplier.supplierCode}
            </p>
          </div>
        </div>

        <SupplierStatusBadge status={supplier.status} />
      </CardHeader>

      <CardContent className="space-y-4">
        <SupplierTypeBadge type={supplier.type} />

        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {supplier.email}
          </p>

          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {supplier.phone}
          </p>

          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {address ? `${address.city}, ${address.country}` : "No address"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3">
          <div>
            <p className="text-xs text-muted-foreground">Products supplied</p>
            <p className="font-semibold">{supplier.products.length}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Outstanding balance</p>
            <p className="font-semibold">
              {formatSupplierCurrency(
                supplier.paymentSummary.outstandingBalance,
                supplier.paymentSummary.currency,
              )}
            </p>
          </div>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link to={`/suppliers/${supplier.id}`}>View supplier</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
