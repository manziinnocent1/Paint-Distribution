
import { z } from "zod";

export const customerSchema = z
  .object({
    customer_type: z.enum(["INDIVIDUAL", "BUSINESS"]),

    first_name: z.string().trim().max(100),

    last_name: z.string().trim().max(100),

    business_name: z.string().trim().max(200).optional(),

    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .optional()
      .or(z.literal("")),

    phone_number: z
      .string()
      .trim()
      .min(9, "Phone number is too short.")
      .max(20, "Phone number is too long."),

    alternate_phone_number: z
      .string()
      .trim()
      .max(20)
      .optional()
      .or(z.literal("")),

    tax_identification_number: z
      .string()
      .trim()
      .max(50)
      .optional()
      .or(z.literal("")),

    notes: z.string().max(2000).optional(),

    status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
  })
  .superRefine((data, ctx) => {
    if (
      data.customer_type === "INDIVIDUAL" &&
      !data.first_name.trim()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["first_name"],
        message: "First name is required.",
      });
    }

    if (
      data.customer_type === "INDIVIDUAL" &&
      !data.last_name.trim()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["last_name"],
        message: "Last name is required.",
      });
    }

    if (
      data.customer_type === "BUSINESS" &&
      !data.business_name?.trim()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["business_name"],
        message: "Business name is required.",
      });
    }
  });

export const customerAddressSchema = z.object({
  address_type: z.enum(["BILLING", "SHIPPING", "BOTH"]),

  address_line_1: z
    .string()
    .trim()
    .min(3, "Address is required.")
    .max(255),

  address_line_2: z.string().max(255).optional(),

  city: z.string().trim().min(2, "City is required.").max(100),

  district: z.string().max(100).optional(),

  province: z.string().max(100).optional(),

  country: z.string().trim().min(2, "Country is required.").max(100),

  postal_code: z.string().max(20).optional(),

  is_default: z.boolean(),
});

export type CustomerSchemaValues = z.infer<typeof customerSchema>;

export type CustomerAddressSchemaValues = z.infer<
  typeof customerAddressSchema
>;
