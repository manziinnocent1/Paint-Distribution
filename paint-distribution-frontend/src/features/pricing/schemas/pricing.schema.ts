import { z } from "zod";

const optionalDate = z.string().optional().or(z.literal(""));

export const createPriceSchema = z
  .object({
    productId: z.string().min(1, "Product is required"),
    productName: z.string().min(1, "Product name is required"),
    productSku: z.string().min(1, "Product SKU is required"),
    variantId: z.string().optional(),
    variantName: z.string().optional(),
    priceListId: z.string().optional(),
    priceListName: z.string().optional(),
    priceType: z.enum([
      "retail",
      "wholesale",
      "promotional",
      "custom",
    ]),
    currency: z.string().min(1, "Currency is required"),
    basePrice: z.coerce.number().positive("Base price must be positive"),
    sellingPrice: z.coerce.number().positive("Selling price must be positive"),
    minimumPrice: z.coerce.number().positive().optional(),
    maximumPrice: z.coerce.number().positive().optional(),
    effectiveFrom: z.string().min(1, "Start date is required"),
    effectiveTo: optionalDate,
    description: z.string().max(500).optional(),
  })
  .refine(
    (data) =>
      !data.minimumPrice || data.sellingPrice >= data.minimumPrice,
    {
      message: "Selling price cannot be below the minimum price",
      path: ["sellingPrice"],
    },
  )
  .refine(
    (data) =>
      !data.maximumPrice || data.sellingPrice <= data.maximumPrice,
    {
      message: "Selling price cannot exceed the maximum price",
      path: ["sellingPrice"],
    },
  )
  .refine(
    (data) =>
      !data.effectiveTo ||
      new Date(data.effectiveTo) >= new Date(data.effectiveFrom),
    {
      message: "End date must be after the start date",
      path: ["effectiveTo"],
    },
  );

export const createPricingRuleSchema = z.object({
  name: z.string().min(2, "Rule name is required"),
  description: z.string().optional(),
  type: z.enum([
    "percentage_discount",
    "fixed_discount",
    "percentage_markup",
    "fixed_markup",
  ]),
  value: z.coerce.number().positive("Rule value must be positive"),
  productId: z.string().optional(),
  categoryId: z.string().optional(),
  priceListId: z.string().optional(),
  minimumQuantity: z.coerce.number().int().positive().optional(),
  maximumDiscount: z.coerce.number().positive().optional(),
  startsAt: z.string().min(1, "Start date is required"),
  endsAt: optionalDate,
});

export const priceAdjustmentSchema = z.object({
  adjustmentType: z.enum(["percentage", "fixed"]),
  adjustmentValue: z.coerce.number().positive("Adjustment must be positive"),
  reason: z.string().min(5, "Please provide a reason"),
});

export type CreatePriceFormValues = z.infer<typeof createPriceSchema>;
export type CreatePricingRuleFormValues = z.infer<
  typeof createPricingRuleSchema
>;
export type PriceAdjustmentFormValues = z.infer<
  typeof priceAdjustmentSchema
>;