
import { z } from "zod";

export const expenseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Expense title must contain at least 2 characters")
    .max(150, "Expense title cannot exceed 150 characters"),

  description: z.string().max(1000).default(""),

  category: z.enum([
    "rent",
    "utilities",
    "transport",
    "salaries",
    "office_supplies",
    "maintenance",
    "marketing",
    "taxes",
    "insurance",
    "communication",
    "other",
  ]),

  amount: z.coerce
    .number()
    .positive("Amount must be greater than zero"),

  expenseDate: z.string().min(1, "Expense date is required"),

  dueDate: z.string().default(""),

  vendorName: z.string().max(150).default(""),

  vendorPhone: z.string().max(30).default(""),

  referenceNumber: z.string().max(100).default(""),

  paymentMethod: z.enum([
    "",
    "cash",
    "mobile_money",
    "bank_transfer",
    "card",
    "cheque",
    "other",
  ]).default(""),

  notes: z.string().max(1000).default(""),

  receiptUrl: z.string().default(""),
}).refine(
  (values) => {
    if (!values.dueDate) return true;
    return values.dueDate >= values.expenseDate;
  },
  {
    message: "Due date cannot be earlier than the expense date",
    path: ["dueDate"],
  },
);

export type ExpenseSchemaValues = z.infer<typeof expenseSchema>;

export const expensePaymentSchema = z.object({
  amount: z.coerce.number().positive("Payment must be greater than zero"),
  paymentMethod: z.enum([
    "cash",
    "mobile_money",
    "bank_transfer",
    "card",
    "cheque",
    "other",
  ]),
  paymentDate: z.string().min(1, "Payment date is required"),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type ExpensePaymentSchemaValues = z.infer<
  typeof expensePaymentSchema
>;
