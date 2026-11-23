import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  DEFAULT_SUPPLIER_CURRENCY,
  SUPPLIER_CURRENCIES,
  SUPPLIER_PAYMENT_TERMS,
  SUPPLIER_STATUSES,
  SUPPLIER_TYPES,
} from "../constants/supplier.constants";

import {
  supplierSchema,
  type SupplierFormValues,
} from "../schemas/supplier.schema";

import type { Supplier } from "../types/supplier.types";

interface SupplierFormProps {
  initialData?: Supplier;
  onSubmit: (values: SupplierFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const defaultValues: SupplierFormValues = {
  name: "",
  legalName: "",
  type: "distributor",
  status: "pending",
  email: "",
  phone: "",
  website: "",
  taxIdentificationNumber: "",
  registrationNumber: "",
  description: "",
  currency: DEFAULT_SUPPLIER_CURRENCY,
  paymentTerms: "Cash on delivery",
  creditLimit: 0,
  addresses: [
    {
      street: "",
      city: "",
      province: "",
      country: "Rwanda",
      postalCode: "",
      isPrimary: true,
    },
  ],
  contacts: [
    {
      name: "",
      email: "",
      phone: "",
      position: "",
      isPrimary: true,
    },
  ],
};

export function SupplierForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save supplier",
}: SupplierFormProps) {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues,
  });

  const addresses = useFieldArray({
    control: form.control,
    name: "addresses",
  });

  const contacts = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  useEffect(() => {
    if (!initialData) return;

    form.reset({
      name: initialData.name,
      legalName: initialData.legalName ?? "",
      type: initialData.type,
      status: initialData.status,
      email: initialData.email,
      phone: initialData.phone,
      website: initialData.website ?? "",
      taxIdentificationNumber: initialData.taxIdentificationNumber ?? "",
      registrationNumber: initialData.registrationNumber ?? "",
      description: initialData.description ?? "",
      currency: initialData.currency,
      paymentTerms: initialData.paymentTerms ?? "",
      creditLimit: initialData.creditLimit ?? 0,
      addresses: initialData.addresses.map(
        ({ id: _id, ...address }) => address,
      ),
      contacts: initialData.contacts.map(({ id: _id, ...contact }) => contact),
    });
  }, [initialData, form]);

  const errors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Supplier name *</Label>
            <Input id="name" {...form.register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="legalName">Legal name</Label>
            <Input id="legalName" {...form.register("legalName")} />
          </div>

          <div className="space-y-2">
            <Label>Supplier type *</Label>
            <Select
              value={form.watch("type")}
              onValueChange={(value) =>
                form.setValue("type", value as SupplierFormValues["type"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select supplier type" />
              </SelectTrigger>
              <SelectContent>
                {SUPPLIER_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status *</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(value) =>
                form.setValue("status", value as SupplierFormValues["status"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {SUPPLIER_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address *</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number *</Label>
            <Input id="phone" {...form.register("phone")} />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" {...form.register("website")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxIdentificationNumber">
              Tax identification number
            </Label>
            <Input
              id="taxIdentificationNumber"
              {...form.register("taxIdentificationNumber")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration number</Label>
            <Input
              id="registrationNumber"
              {...form.register("registrationNumber")}
            />
          </div>

          <div className="space-y-2">
            <Label>Currency</Label>
            <Select
              value={form.watch("currency")}
              onValueChange={(value) => form.setValue("currency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {SUPPLIER_CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Payment terms</Label>
            <Select
              value={form.watch("paymentTerms") || ""}
              onValueChange={(value) => form.setValue("paymentTerms", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent>
                {SUPPLIER_PAYMENT_TERMS.map((term) => (
                  <SelectItem key={term} value={term}>
                    {term}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditLimit">Credit limit</Label>
            <Input
              id="creditLimit"
              type="number"
              min="0"
              {...form.register("creditLimit", {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              {...form.register("description")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Supplier addresses</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              addresses.append({
                street: "",
                city: "",
                province: "",
                country: "Rwanda",
                postalCode: "",
                isPrimary: false,
              })
            }
          >
            Add address
          </Button>
        </CardHeader>

        <CardContent className="space-y-5">
          {addresses.fields.map((field, index) => (
            <div key={field.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Address {index + 1}</p>
                {addresses.fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addresses.remove(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  placeholder="Street address"
                  {...form.register(`addresses.${index}.street`)}
                />
                <Input
                  placeholder="City"
                  {...form.register(`addresses.${index}.city`)}
                />
                <Input
                  placeholder="Province"
                  {...form.register(`addresses.${index}.province`)}
                />
                <Input
                  placeholder="Country"
                  {...form.register(`addresses.${index}.country`)}
                />
                <Input
                  placeholder="Postal code"
                  {...form.register(`addresses.${index}.postalCode`)}
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.watch(`addresses.${index}.isPrimary`)}
                  onCheckedChange={(checked) =>
                    form.setValue(
                      `addresses.${index}.isPrimary`,
                      checked === true,
                    )
                  }
                />
                Primary address
              </label>
            </div>
          ))}
          {errors.addresses?.message && (
            <p className="text-sm text-destructive">
              {errors.addresses.message}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contact persons</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              contacts.append({
                name: "",
                email: "",
                phone: "",
                position: "",
                isPrimary: false,
              })
            }
          >
            Add contact
          </Button>
        </CardHeader>

        <CardContent className="space-y-5">
          {contacts.fields.map((field, index) => (
            <div key={field.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Contact {index + 1}</p>
                {contacts.fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => contacts.remove(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  placeholder="Full name"
                  {...form.register(`contacts.${index}.name`)}
                />
                <Input
                  placeholder="Position"
                  {...form.register(`contacts.${index}.position`)}
                />
                <Input
                  placeholder="Email address"
                  type="email"
                  {...form.register(`contacts.${index}.email`)}
                />
                <Input
                  placeholder="Phone number"
                  {...form.register(`contacts.${index}.phone`)}
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.watch(`contacts.${index}.isPrimary`)}
                  onCheckedChange={(checked) =>
                    form.setValue(
                      `contacts.${index}.isPrimary`,
                      checked === true,
                    )
                  }
                />
                Primary contact
              </label>
            </div>
          ))}
          {errors.contacts?.message && (
            <p className="text-sm text-destructive">
              {errors.contacts.message}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset(defaultValues)}
        >
          Reset
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
