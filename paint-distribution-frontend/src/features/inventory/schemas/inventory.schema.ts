import { z } from "zod";

export const stockAdjustmentSchema = z.object({
  stockItemId: z.string().min(1, "Please select a stock item."),
  movementType: z.enum([
    "stock_in",
    "stock_out",
    "adjustment",
    "transfer",
  ]),
  quantity: z.coerce
    .number()
    .positive("Quantity must be greater than zero."),
  referenceNumber: z
    .string()
    .trim()
    .min(1, "Reference number is required."),
  reason: z.string().trim().min(3, "Please provide a reason."),
  movementDate: z.string().min(1, "Movement date is required."),
});

export const warehouseSchema = z.object({
  name: z.string().trim().min(2, "Warehouse name is required."),
  code: z.string().trim().min(2, "Warehouse code is required."),
  description: z.string().optional(),
  address: z.string().trim().min(3, "Address is required."),
  city: z.string().trim().min(2, "City is required."),
  managerName: z.string().optional(),
  contactNumber: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type StockAdjustmentFormData = z.infer<
  typeof stockAdjustmentSchema
>;

export type WarehouseFormData = z.infer<typeof warehouseSchema>;