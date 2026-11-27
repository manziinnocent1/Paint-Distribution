import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type {
  CustomerAddress,
  CustomerAddressFormValues,
} from "../../types/customer.types";

import { customerAddressSchema } from "../../schemas/customer.schema";
import { CUSTOMER_ADDRESS_TYPES } from "../../constants/customer.constants";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface CustomerAddressFormProps {
  initialData?: CustomerAddress;
  onSubmit: (values: CustomerAddressFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function CustomerAddressForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CustomerAddressFormProps) {
  const form = useForm<CustomerAddressFormValues>({
    resolver: zodResolver(customerAddressSchema),
    defaultValues: {
      address_type: "BOTH",
      address_line_1: "",
      address_line_2: "",
      city: "",
      district: "",
      province: "",
      country: "Rwanda",
      postal_code: "",
      is_default: false,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        address_type: initialData.address_type,
        address_line_1: initialData.address_line_1,
        address_line_2: initialData.address_line_2 ?? "",
        city: initialData.city,
        district: initialData.district ?? "",
        province: initialData.province ?? "",
        country: initialData.country,
        postal_code: initialData.postal_code ?? "",
        is_default: initialData.is_default,
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="address_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select address type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CUSTOMER_ADDRESS_TYPES.map((type) => (
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

        <FormField
          control={form.control}
          name="address_line_1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address line 1</FormLabel>
              <FormControl>
                <Input
                  placeholder="Street, building or house number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address_line_2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address line 2</FormLabel>
              <FormControl>
                <Input
                  placeholder="Apartment, floor or additional details"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District</FormLabel>
                <FormControl>
                  <Input placeholder="District" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Input placeholder="Province" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal code</FormLabel>
              <FormControl>
                <Input placeholder="Postal code (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_default"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <FormLabel>Default address</FormLabel>
                <p className="text-xs text-muted-foreground">
                  Use this as the customer's primary address.
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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
                ? "Update address"
                : "Add address"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
