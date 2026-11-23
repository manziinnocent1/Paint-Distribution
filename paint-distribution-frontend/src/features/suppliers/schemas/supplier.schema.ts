import { z } from "zod";

const addressSchema = z.object({
  street: z.string().min(2, "Street address is required"),
  city: z.string().min(2, "City is required"),
  province: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

const contactSchema = z.object({
  name: z.string().min(2, "Contact name is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().min(7, "Enter a valid phone number"),
  position: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

export const supplierSchema = z.object({
  name: z.string().min(2, "Supplier name is required"),
  legalName: z.string().optional(),
  type: z.enum([
    "manufacturer",
    "distributor",
    "wholesaler",
    "retailer",
    "other",
  ]),
  status: z.enum(["active", "inactive", "pending", "suspended"]),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  taxIdentificationNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
  description: z.string().max(1000).optional(),
  currency: z.string().min(3),
  paymentTerms: z.string().optional(),
  creditLimit: z.coerce.number().min(0).optional(),
  addresses: z.array(addressSchema).min(1, "Add at least one address"),
  contacts: z.array(contactSchema).min(1, "Add at least one contact"),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;