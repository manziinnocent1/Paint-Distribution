import { z } from "zod";

export const saleItemSchema = z.object({
  productId: z.string().min(1, "Select a product"),
  productName: z.string().min(1, "Product name is required"),
  productSku: z.string().min(1, "Product SKU is required"),
  variantId: z.string().optional(),
  variantName: z.string().optional(),
  quantity: z.coerce.number().positive("Quantity must be greater than zero"),
  unitPrice: z.coerce.number().nonnegative("Price cannot be negative"),
  discountPercentage: z.coerce
    .number()
    .min(0)
    .max(100, "Discount cannot exceed 100%"),
  taxPercentage: z.coerce
    .number()
    .min(0)
    .max(100, "Tax cannot exceed 100%"),
});

export const saleSchema = z
  .object({
    customer: z.object({
      id: z.string().min(1, "Select a customer"),
      name: z.string().min(1, "Customer name is required"),
      email: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
    }),
    items: z.array(saleItemSchema).min(1, "Add at least one product"),
    saleDate: z.string().min(1, "Sale date is required"),
    expectedDeliveryDate: z.string().optional(),
    paymentMethod: z
      .enum(["cash", "mobile_money", "card", "bank_transfer", "credit"])
      .optional(),
    amountPaid: z.coerce.number().min(0, "Amount paid cannot be negative"),
    notes: z.string().optional(),
    termsAndConditions: z.string().optional(),
    currency: z.string().min(1, "Currency is required"),
    status: z.enum([
      "draft",
      "pending",
      "confirmed",
      "processing",
      "completed",
      "cancelled",
    ]),
  })
  .refine(
    (value) =>
      !value.expectedDeliveryDate ||
      value.expectedDeliveryDate >= value.saleDate,
    {
      message: "Expected delivery cannot be before the sale date",
      path: ["expectedDeliveryDate"],
    },
  );

export type SaleFormValues = z.infer<typeof saleSchema>;
export type SaleItemFormValues = z.infer<typeof saleItemSchema>;