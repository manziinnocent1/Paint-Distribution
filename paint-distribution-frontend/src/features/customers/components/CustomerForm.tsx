import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Customer, CustomerFormValues } from "../types/customer.types";

import { customerSchema } from "../schemas/customer.schema";
import {
  CUSTOMER_STATUSES,
  CUSTOMER_TYPES,
} from "../constants/customer.constants";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface CustomerFormProps {
  initialData?: Customer;
  onSubmit: (values: CustomerFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function CustomerForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CustomerFormProps) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customer_type: "INDIVIDUAL",
      first_name: "",
      last_name: "",
      business_name: "",
      email: "",
      phone_number: "",
      alternate_phone_number: "",
      tax_identification_number: "",
      notes: "",
      status: "ACTIVE",
    },
  });

  const customerType = form.watch("customer_type");

  useEffect(() => {
    if (initialData) {
      form.reset({
        customer_type: initialData.customer_type,
        first_name: initialData.first_name ?? "",
        last_name: initialData.last_name ?? "",
        business_name: initialData.business_name ?? "",
        email: initialData.email ?? "",
        phone_number: initialData.phone_number,
        alternate_phone_number: initialData.alternate_phone_number ?? "",
        tax_identification_number: initialData.tax_identification_number ?? "",
        notes: initialData.notes ?? "",
        status: initialData.status,
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="customer_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CUSTOMER_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {customerType === "INDIVIDUAL" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : (
          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter registered business name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary phone number</FormLabel>
                <FormControl>
                  <Input placeholder="+250788000000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alternate_phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alternative phone</FormLabel>
                <FormControl>
                  <Input placeholder="+250788000000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="customer@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tax_identification_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax identification number (TIN)</FormLabel>
              <FormControl>
                <Input placeholder="Enter TIN" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional customer information..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CUSTOMER_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : initialData
                ? "Update customer"
                : "Create customer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
