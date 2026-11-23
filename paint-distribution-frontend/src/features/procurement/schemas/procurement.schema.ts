import { z } from "zod";

const procurementItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  productName: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  quantity: z.coerce.number().positive("Quantity must be greater than zero"),
  estimatedUnitPrice: z.coerce
    .number()
    .nonnegative("Price cannot be negative"),
  notes: z.string().optional(),
});

export const procurementRequestSchema = z.object({
  title: z.string().min(3, "Title must contain at least 3 characters"),
  description: z.string().min(5, "Please provide a description"),
  department: z.string().min(1, "Department is required"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  requiredDate: z.string().min(1, "Required date is required"),
  items: z.array(procurementItemSchema).min(1, "Add at least one item"),
});

export const purchaseOrderSchema = z.object({
  procurementRequestId: z.string().optional(),
  supplierId: z.string().min(1, "Select a supplier"),
  supplierName: z.string().min(1, "Supplier name is required"),
  orderDate: z.string().min(1, "Order date is required"),
  expectedDeliveryDate: z.string().min(1, "Expected delivery date is required"),
  tax: z.coerce.number().min(0, "Tax cannot be negative"),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        productName: z.string().min(1),
        sku: z.string().min(1),
        quantity: z.coerce.number().positive(),
        unitPrice: z.coerce.number().min(0),
        notes: z.string().optional(),
      }),
    )
    .min(1, "Add at least one item"),
});

export const goodsReceiptSchema = z.object({
  purchaseOrderId: z.string().min(1, "Select a purchase order"),
  receivedDate: z.string().min(1, "Receipt date is required"),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        purchaseOrderItemId: z.string().min(1),
        productName: z.string(),
        sku: z.string(),
        orderedQuantity: z.coerce.number().positive(),
        receivedQuantity: z.coerce.number().min(0),
        acceptedQuantity: z.coerce.number().min(0),
        rejectedQuantity: z.coerce.number().min(0),
        notes: z.string().optional(),
      }),
    )
    .min(1, "At least one receipt item is required")
    .refine(
      (items) =>
        items.every(
          (item) =>
            item.acceptedQuantity + item.rejectedQuantity <=
            item.receivedQuantity,
        ),
      "Accepted and rejected quantities cannot exceed received quantity",
    ),
});

export type ProcurementRequestFormValues = z.infer<
  typeof procurementRequestSchema
>;
export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>;
export type GoodsReceiptFormValues = z.infer<typeof goodsReceiptSchema>;