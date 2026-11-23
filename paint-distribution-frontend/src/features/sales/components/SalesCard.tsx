import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Sale } from "../types/sales.types";
import { formatSaleCurrency, formatSaleDate } from "../utils/sales.utils";
import { SalesPaymentBadge, SalesStatusBadge } from "./SalesStatusBadge";

export function SalesCard({ sale }: { sale: Sale }) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground">{sale.saleNumber}</p>
            <CardTitle className="mt-1 text-base">
              {sale.customer.name}
            </CardTitle>
          </div>
          <SalesStatusBadge status={sale.status} />
        </div>
        <SalesPaymentBadge status={sale.paymentStatus} />
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          {formatSaleDate(sale.saleDate)}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserRound className="h-4 w-4" />
          {sale.customer.phone ||
            sale.customer.email ||
            "No contact information"}
        </div>
        <div className="flex justify-between border-t pt-3">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-semibold">
            {formatSaleCurrency(sale.total, sale.currency)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Balance due</span>
          <span className="font-medium">
            {formatSaleCurrency(sale.balanceDue, sale.currency)}
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to={`/sales/${sale.id}`}>
            View sale
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
