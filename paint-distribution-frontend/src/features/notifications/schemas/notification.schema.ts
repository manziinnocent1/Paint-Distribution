import { z } from "zod";

const categoryPreferenceSchema = z.object({
  enabled: z.boolean(),
  inApp: z.boolean(),
  email: z.boolean(),
  sms: z.boolean(),
  push: z.boolean(),
});

export const notificationPreferencesSchema = z.object({
  categories: z.object({
    orders: categoryPreferenceSchema,
    payments: categoryPreferenceSchema,
    inventory: categoryPreferenceSchema,
    deliveries: categoryPreferenceSchema,
    customers: categoryPreferenceSchema,
    system: categoryPreferenceSchema,
  }),

  emailAddress: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .or(z.literal("")),

  phoneNumber: z.string().trim(),

  quietHoursEnabled: z.boolean(),

  quietHoursStart: z.string().regex(
    /^([01]\d|2[0-3]):[0-5]\d$/,
    "Enter a valid start time.",
  ),

  quietHoursEnd: z.string().regex(
    /^([01]\d|2[0-3]):[0-5]\d$/,
    "Enter a valid end time.",
  ),
});

export type NotificationPreferencesFormData = z.infer<
  typeof notificationPreferencesSchema
>;