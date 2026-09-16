import { z } from "zod";
import { CURRENCIES } from "@/lib/domain";

const currencySchema = z.enum(CURRENCIES);

const moneySchema = z.coerce
  .number()
  .finite()
  .min(0, "The amount cannot be negative.")
  .max(999_999_999, "The amount is too high.");

const dateSchema = z
  .string()
  .min(1, "Date and time are required.")
  .transform((value) => new Date(value))
  .refine((value) => !Number.isNaN(value.getTime()), "Invalid date.");

const optionalDateSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  dateSchema.optional(),
);
const optionalMoneySchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  moneySchema.optional(),
);

export const sessionSchema = z
  .object({
    id: z.string().cuid().optional(),
    gameCategoryId: z.string().min(1).max(50),
    platformId: z.string().cuid(),
    currency: currencySchema,
    startedAt: dateSchema,
    endedAt: optionalDateSchema,
    buyIn: moneySchema,
    cashOut: optionalMoneySchema,
    notes: z.string().trim().max(500).optional(),
    isRunning: z.enum(["true", "false"]).default("false"),
    convertToDefaultCurrency: z.enum(["true", "false"]).default("false"),
  })
  .superRefine((value, context) => {
    if (value.isRunning === "true") return;
    if (!value.endedAt) {
      context.addIssue({ code: "custom", path: ["endedAt"], message: "End time is required." });
    }
    if (value.cashOut === undefined) {
      context.addIssue({ code: "custom", path: ["cashOut"], message: "Cash-out is required." });
    }
    if (
      value.endedAt instanceof Date &&
      value.endedAt.getTime() <= value.startedAt.getTime()
    ) {
      context.addIssue({
        code: "custom",
        path: ["endedAt"],
        message: "End time must be after start time.",
      });
    }
  });

export const platformSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "At least 2 characters.")
    .max(50, "No more than 50 characters."),
});

export const transactionSchema = z.object({
  type: z.enum(["STARTING_BALANCE", "DEPOSIT", "WITHDRAWAL"]),
  amount: moneySchema.positive("The amount must be greater than zero."),
  currency: currencySchema,
  occurredAt: dateSchema,
  note: z.string().trim().max(200).optional(),
});

export const settingsSchema = z.object({
  defaultCurrency: currencySchema,
});
