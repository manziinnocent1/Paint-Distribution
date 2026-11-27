
import { z } from "zod";
import { COLOR_HEX_PATTERN } from "../constants/color.constants";

export const colorSchema = z.object({
  name: z.string().min(2, "Color name must contain at least 2 characters").max(100),
  code: z.string().min(2, "Color code is required").max(50),
  hex_code: z
    .string()
    .regex(COLOR_HEX_PATTERN, "Enter a valid HEX color, e.g. #FFFFFF"),
  rgb_value: z.string().optional().default(""),
  description: z.string().max(500).optional().default(""),
  family: z.string().optional().default(""),
  is_active: z.boolean().default(true),
});

export const colorFamilySchema = z.object({
  name: z.string().min(2, "Family name is required").max(100),
  code: z.string().min(2, "Family code is required").max(50),
  description: z.string().max(500).optional().default(""),
  is_active: z.boolean().default(true),
});

export const colorFormulaIngredientSchema = z.object({
  color: z.string().min(1, "Select an ingredient color"),
  color_name: z.string().optional(),
  color_code: z.string().optional(),
  quantity: z.number().positive("Quantity must be greater than zero"),
  unit: z.enum(["ml", "g", "kg", "l"]),
  percentage: z.number().min(0).max(100).optional(),
});

export const colorFormulaSchema = z.object({
  name: z.string().min(2, "Formula name is required").max(100),
  code: z.string().min(2, "Formula code is required").max(50),
  description: z.string().max(500).optional().default(""),
  target_color: z.string().min(1, "Select a target color"),
  ingredients: z
    .array(colorFormulaIngredientSchema)
    .min(1, "Add at least one ingredient"),
  is_active: z.boolean().default(true),
}).superRefine((data, ctx) => {
  const quantities = data.ingredients.map((item) => item.quantity);

  if (quantities.some((quantity) => !Number.isFinite(quantity))) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ingredient quantities must be valid numbers",
      path: ["ingredients"],
    });
  }
});

export type ColorSchemaInput = z.input<typeof colorSchema>;
export type ColorSchemaValues = z.output<typeof colorSchema>;

export type ColorFamilySchemaInput = z.input<typeof colorFamilySchema>;
export type ColorFamilySchemaValues = z.output<typeof colorFamilySchema>;

export type ColorFormulaSchemaInput = z.input<typeof colorFormulaSchema>;
export type ColorFormulaSchemaValues = z.output<typeof colorFormulaSchema>;
