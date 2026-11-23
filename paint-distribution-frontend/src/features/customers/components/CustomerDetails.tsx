import {
  CalendarDays,
  Mail,
  Phone,
  Hash,
  Building2,
  ShoppingBag,
  MapPin,
} from "lucide-react";

import type { Customer } from "../types/customer.types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CustomerAvatar } from "./shared/CustomerAvatar";
import { CustomerStatusBadge } from "./shared/CustomerStatusBadge";
import { CustomerTypeBadge } from "./shared/CustomerTypeBadge";

import {
  getCustomerFullName,
  formatCustomerDate,
  formatCustomerCurrency,
  formatCustomerAddress,
} from "../utils/customer.utils";

interface CustomerDetailsProps {
  customer: Customer;
}

export function CustomerDetails({ customer }: CustomerDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <CustomerAvatar customer={customer} size="lg" />

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold">
              {getCustomerFullName(customer)}
            </h2>
            <p className="font-mono text-sm text-muted-foreground">
              {customer.customer_number}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <CustomerTypeBadge type={customer.customer_type} />
              <CustomerStatusBadge status={customer.status} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total orders</p>
                <p className="text-xl font-bold">
                  {customer.total_orders ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total spending</p>
                <p className="text-xl font-bold">
                  {formatCustomerCurrency(customer.total_spent)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Customer number</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-medium">
              <Hash className="h-4 w-4" />
              {customer.customer_number}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Phone number</p>
            <p className="mt-1 flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4" />
              {customer.phone_number}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Alternative phone</p>
            <p className="mt-1 text-sm">
              {customer.alternate_phone_number || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Email address</p>
            <p className="mt-1 flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              {customer.email || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Tax identification number
            </p>
            <p className="mt-1 text-sm">
              {customer.tax_identification_number || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Last order</p>
            <p className="mt-1 text-sm">
              {formatCustomerDate(customer.last_order_date)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Registration date</p>
            <p className="mt-1 flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4" />
              {formatCustomerDate(customer.created_at)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Last updated</p>
            <p className="mt-1 text-sm">
              {formatCustomerDate(customer.updated_at)}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs text-muted-foreground">Notes</p>
            <p className="mt-1 text-sm">
              {customer.notes || "No additional notes."}
            </p>
          </div>
        </CardContent>
      </Card>

      {customer.addresses && customer.addresses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer addresses</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {customer.addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-start gap-3 rounded-lg border p-4"
              >
                <MapPin className="mt-1 h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    {formatCustomerAddress(address)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {address.address_type}
                    {address.is_default ? " · Default address" : ""}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
