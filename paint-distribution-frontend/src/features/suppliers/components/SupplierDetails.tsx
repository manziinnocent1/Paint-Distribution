import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Supplier } from "../types/supplier.types";
import {
  formatSupplierDate,
  getPrimarySupplierContact,
} from "../utils/supplier.utils";

import { SupplierAvatar } from "./SupplierAvatar";
import { SupplierStatusBadge } from "./SupplierStatusBadge";
import { SupplierTypeBadge } from "./SupplierTypeBadge";
import { SupplierProducts } from "./SupplierProducts";
import { SupplierPaymentSummary } from "./SupplierPaymentSummary";

export function SupplierDetails({ supplier }: { supplier: Supplier }) {
  const primaryContact = getPrimarySupplierContact(supplier);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" asChild>
          <Link to="/suppliers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to suppliers
          </Link>
        </Button>

        <Button asChild>
          <Link to={`/suppliers/${supplier.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit supplier
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center">
          <SupplierAvatar name={supplier.name} size="lg" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{supplier.name}</h1>
              <SupplierStatusBadge status={supplier.status} />
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              {supplier.supplierCode}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <SupplierTypeBadge type={supplier.type} />
              <span className="text-sm text-muted-foreground">
                Registered {formatSupplierDate(supplier.createdAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company information
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Legal name</p>
                <p className="font-medium">{supplier.legalName || "—"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="flex items-center gap-2 font-medium">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {supplier.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="flex items-center gap-2 font-medium">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {supplier.phone}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Website</p>
                <p className="flex items-center gap-2 font-medium">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  {supplier.website || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Tax identification number
                </p>
                <p className="font-medium">
                  {supplier.taxIdentificationNumber || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Registration number
                </p>
                <p className="font-medium">
                  {supplier.registrationNumber || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Payment terms</p>
                <p className="font-medium">{supplier.paymentTerms || "—"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Credit limit</p>
                <p className="font-medium">
                  {supplier.creditLimit != null
                    ? new Intl.NumberFormat("en-RW", {
                        style: "currency",
                        currency: supplier.currency,
                      }).format(supplier.creditLimit)
                    : "—"}
                </p>
              </div>

              {supplier.description && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-1">{supplier.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Addresses
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2">
              {supplier.addresses.map((address) => (
                <div key={address.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">
                      {address.isPrimary ? "Primary address" : "Address"}
                    </p>
                    {address.isPrimary && (
                      <span className="text-xs text-primary">Primary</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {[
                      address.street,
                      address.city,
                      address.province,
                      address.country,
                      address.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact persons</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2">
              {supplier.contacts.map((contact) => (
                <div key={contact.id} className="rounded-lg border p-4">
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {contact.position || "Contact person"}
                  </p>
                  <p className="mt-2 text-sm">{contact.phone}</p>
                  {contact.email && (
                    <p className="text-sm text-muted-foreground">
                      {contact.email}
                    </p>
                  )}
                  {contact.isPrimary && (
                    <p className="mt-2 text-xs text-primary">Primary contact</p>
                  )}
                </div>
              ))}
              {!primaryContact && (
                <p className="text-sm text-muted-foreground">
                  No contacts have been added.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <SupplierPaymentSummary summary={supplier.paymentSummary} />
        </div>
      </div>

      <SupplierProducts products={supplier.products} />
    </div>
  );
}
