import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { SalesItemsForm } from "./SalesItemsForm";
import { saleSchema, type SaleFormValues } from "../schemas/sales.schema";
import {
  DEFAULT_SALE_CURRENCY,
  SALE_PAYMENT_METHODS,
} from "../constants/sales.constants";
import type { Sale, SaleItemInput } from "../types/sales.types";
import { calculateSaleItem } from "../utils/sales.utils";

type Props = {
  initialData?: Sale;
  isSubmitting?: boolean;
  onSubmit: (values: SaleFormValues) => void;
};

function toItemInput(item: Sale["items"][number]): SaleItemInput {
  return {
    productId: item.productId,
    productName: item.productName,
    productSku: item.productSku,
    variantId: item.variantId,
    variantName: item.variantName,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    discountPercentage: item.discountPercentage,
    taxPercentage: item.taxPercentage,
  };
}

export function SalesForm({
  initialData,
  isSubmitting = false,
  onSubmit,
}: Props) {
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      customer: initialData?.customer ?? {
        id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
      },
      items: initialData?.items.map(toItemInput) ?? [],
      saleDate: initialData?.saleDate ?? new Date().toISOString().slice(0, 10),
      expectedDeliveryDate: initialData?.expectedDeliveryDate ?? "",
      paymentMethod: initialData?.paymentMethod ?? "cash",
      amountPaid: initialData?.amountPaid ?? 0,
      notes: initialData?.notes ?? "",
      termsAndConditions: initialData?.termsAndConditions ?? "",
      currency: initialData?.currency ?? DEFAULT_SALE_CURRENCY,
      status: initialData?.status ?? "pending",
    },
  });

  const items = form.watch("items");

  useEffect(() => {
    if (initialData) {
      form.reset({
        customer: initialData.customer,
        items: initialData.items.map(toItemInput),
        saleDate: initialData.saleDate,
        expectedDeliveryDate: initialData.expectedDeliveryDate ?? "",
        paymentMethod: initialData.paymentMethod ?? "cash",
        amountPaid: initialData.amountPaid,
        notes: initialData.notes ?? "",
        termsAndConditions: initialData.termsAndConditions ?? "",
        currency: initialData.currency,
        status: initialData.status,
      });
    }
  }, [initialData, form]);

  const calculatedTotal = items.reduce((sum, item) => {
    return sum + calculateSaleItem(item).total;
  }, 0);

  return (
    <form
      className="space-y-8"
      onSubmit={form.handleSubmit((values) => onSubmit(values))}
    >
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Customer information</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customerId">Customer ID</Label>
            <Input
              id="customerId"
              {...form.register("customer.id")}
              placeholder="Enter customer ID"
            />
            <p className="text-xs text-muted-foreground">
              Replace this field with the customer selector when connecting the
              customers feature.
            </p>
            <p className="text-sm text-destructive">
              {form.formState.errors.customer?.id?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerName">Customer name</Label>
            <Input
              id="customerName"
              {...form.register("customer.name")}
              placeholder="Customer or company name"
            />
            <p className="text-sm text-destructive">
              {form.formState.errors.customer?.name?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              type="email"
              {...form.register("customer.email")}
              placeholder="customer@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone</Label>
            <Input
              id="customerPhone"
              {...form.register("customer.phone")}
              placeholder="+250..."
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="customerAddress">Address</Label>
            <Input
              id="customerAddress"
              {...form.register("customer.address")}
              placeholder="Customer address"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Sale products</h2>
        <SalesItemsForm
          items={items}
          onChange={(nextItems) =>
            form.setValue("items", nextItems, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
        <p className="text-sm text-destructive">
          {form.formState.errors.items?.message}
        </p>
        <div className="rounded-lg bg-muted p-4 text-right">
          <p className="text-sm text-muted-foreground">Estimated total</p>
          <p className="text-xl font-bold">
            {new Intl.NumberFormat("en-RW", {
              style: "currency",
              currency: form.watch("currency") || DEFAULT_SALE_CURRENCY,
              maximumFractionDigits: 0,
            }).format(calculatedTotal)}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Sale information</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="saleDate">Sale date</Label>
            <Input id="saleDate" type="date" {...form.register("saleDate")} />
            <p className="text-sm text-destructive">
              {form.formState.errors.saleDate?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedDeliveryDate">Expected delivery date</Label>
            <Input
              id="expectedDeliveryDate"
              type="date"
              min={form.watch("saleDate")}
              {...form.register("expectedDeliveryDate")}
            />
            <p className="text-sm text-destructive">
              {form.formState.errors.expectedDeliveryDate?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Payment method</Label>
            <Select
              value={form.watch("paymentMethod") ?? "cash"}
              onValueChange={(value) =>
                form.setValue(
                  "paymentMethod",
                  value as SaleFormValues["paymentMethod"],
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {SALE_PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amountPaid">Initial payment</Label>
            <Input
              id="amountPaid"
              type="number"
              min="0"
              {...form.register("amountPaid", { valueAsNumber: true })}
            />
            <p className="text-sm text-destructive">
              {form.formState.errors.amountPaid?.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" {...form.register("currency")} />
          </div>

          <div className="space-y-2">
            <Label>Sale status</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(value) =>
                form.setValue("status", value as SaleFormValues["status"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Additional sale or delivery instructions..."
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="termsAndConditions">Terms and conditions</Label>
            <Textarea
              id="termsAndConditions"
              {...form.register("termsAndConditions")}
              placeholder="Enter applicable sale terms..."
            />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-3 border-t pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          disabled={isSubmitting}
        >
          Reset
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Save changes"
              : "Create sale"}
        </Button>
      </div>
    </form>
  );
}
