import { z } from "zod";
import { COLOR_HEX_PATTERN } from "../constants/color.constants";

export const colorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Color name must contain at least 2 characters")
    .max(100),
  code: z.string().trim().min(2, "Color code is required").max(50),
  hex_code: z
    .string()
    .regex(COLOR_HEX_PATTERN, "Enter a valid HEX color, e.g. #FFFFFF"),
  rgb_value: z.string(),
  description: z.string().max(500),
  family: z.string(),
  is_active: z.boolean(),
});

export const colorFamilySchema = z.object({
  name: z.string().trim().min(2, "Family name is required").max(100),
  code: z.string().trim().min(2, "Family code is required").max(50),
  description: z.string().max(500),
  is_active: z.boolean(),
});

export const colorFormulaIngredientSchema = z.object({
  id: z.string().optional(),
  color: z.string().min(1, "Select an ingredient color"),
  color_name: z.string().optional(),
  color_code: z.string().optional(),
  quantity: z.number().positive("Quantity must be greater than zero"),
  unit: z.enum(["ml", "g", "kg", "l"]),
  percentage: z.number().min(0).max(100).optional(),
});

export const colorFormulaSchema = z
  .object({
    name: z.string().trim().min(2, "Formula name is required").max(100),
    code: z.string().trim().min(2, "Formula code is required").max(50),
    description: z.string().max(500),
    target_color: z.string().min(1, "Select a target color"),
    ingredients: z
      .array(colorFormulaIngredientSchema)
      .min(1, "Add at least one ingredient"),
    is_active: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const hasInvalidQuantity = data.ingredients.some(
      (item) => !Number.isFinite(item.quantity)
    );

    if (hasInvalidQuantity) {
      ctx.addIssue({
        code: "custom",
        message: "Ingredient quantities must be valid numbers",
        path: ["ingredients"],
      });
    }
  });

export type ColorSchemaValues = z.infer<typeof colorSchema>;
export type ColorFamilySchemaValues = z.infer<typeof colorFamilySchema>;
export type ColorFormulaSchemaValues = z.infer<typeof colorFormulaSchema>;