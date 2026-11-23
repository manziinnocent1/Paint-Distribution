import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  PRICE_TYPES,
  PRICING_CURRENCIES,
} from "../constants/pricing.constants";
import {
  createPriceSchema,
  type CreatePriceFormValues,
} from "../schemas/pricing.schema";
import { useCreatePrice, useUpdatePrice } from "../hooks/usePricingMutations";
import type { ProductPrice } from "../types/pricing.types";

interface Props {
  price?: ProductPrice;
}

export function PricingForm({ price }: Props) {
  const navigate = useNavigate();
  const createPrice = useCreatePrice();
  const updatePrice = useUpdatePrice();

  const form = useForm<CreatePriceFormValues>({
    resolver: zodResolver(createPriceSchema),
    defaultValues: {
      productId: price?.productId ?? "",
      productName: price?.productName ?? "",
      productSku: price?.productSku ?? "",
      variantId: price?.variantId ?? "",
      variantName: price?.variantName ?? "",
      priceListId: price?.priceListId ?? "",
      priceListName: price?.priceListName ?? "",
      priceType: price?.priceType ?? "retail",
      currency: price?.currency ?? "RWF",
      basePrice: price?.basePrice ?? 0,
      sellingPrice: price?.sellingPrice ?? 0,
      minimumPrice: price?.minimumPrice,
      maximumPrice: price?.maximumPrice,
      effectiveFrom:
        price?.effectiveFrom.slice(0, 10) ??
        new Date().toISOString().slice(0, 10),
      effectiveTo: price?.effectiveTo?.slice(0, 10) ?? "",
      description: price?.description ?? "",
    },
  });

  useEffect(() => {
    if (!price) return;

    form.reset({
      productId: price.productId,
      productName: price.productName,
      productSku: price.productSku,
      variantId: price.variantId ?? "",
      variantName: price.variantName ?? "",
      priceListId: price.priceListId ?? "",
      priceListName: price.priceListName ?? "",
      priceType: price.priceType,
      currency: price.currency,
      basePrice: price.basePrice,
      sellingPrice: price.sellingPrice,
      minimumPrice: price.minimumPrice,
      maximumPrice: price.maximumPrice,
      effectiveFrom: price.effectiveFrom.slice(0, 10),
      effectiveTo: price.effectiveTo?.slice(0, 10) ?? "",
      description: price.description ?? "",
    });
  }, [price, form]);

  async function onSubmit(values: CreatePriceFormValues) {
    const input = {
      ...values,
      variantId: values.variantId || undefined,
      variantName: values.variantName || undefined,
      priceListId: values.priceListId || undefined,
      priceListName: values.priceListName || undefined,
      effectiveTo: values.effectiveTo || undefined,
      description: values.description || undefined,
    };

    try {
      if (price) {
        await updatePrice.mutateAsync({
          id: price.id,
          input,
        });
        toast.success("Price updated successfully.");
        navigate(`/pricing/${price.id}`);
      } else {
        const created = await createPrice.mutateAsync(input);
        toast.success("Price created successfully.");
        navigate(`/pricing/${created.id}`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save price.",
      );
    }
  }

  const isPending = createPrice.isPending || updatePrice.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product ID</FormLabel>
                <FormControl>
                  <Input placeholder="Product ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="productSku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product SKU</FormLabel>
                <FormControl>
                  <Input placeholder="Product SKU" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="variantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variant ID (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Product variant ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="variantName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variant name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 20 Litre White" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRICE_TYPES.map((type) => (
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
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRICING_CURRENCIES.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
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
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={field.value}
                    onChange={(event) =>
                      field.onChange(Number(event.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sellingPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={field.value}
                    onChange={(event) =>
                      field.onChange(Number(event.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minimumPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                    value={field.value ?? ""}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value
                          ? Number(event.target.value)
                          : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maximumPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                    value={field.value ?? ""}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value
                          ? Number(event.target.value)
                          : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="effectiveFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Effective from</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="effectiveTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Effective until</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Add pricing notes..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/pricing")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : price ? "Save changes" : "Create price"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
