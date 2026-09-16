import { z } from "zod";
import { CURRENCIES, GAME_TYPE_VALUES } from "@/lib/domain";

const currencySchema = z.enum(CURRENCIES);

const moneySchema = z.coerce
  .number()
  .finite()
  .min(0, "Der Betrag darf nicht negativ sein.")
  .max(999_999_999, "Der Betrag ist zu hoch.");

const dateSchema = z
  .string()
  .min(1, "Datum und Uhrzeit fehlen.")
  .transform((value) => new Date(value))
  .refine((value) => !Number.isNaN(value.getTime()), "Ungültiges Datum.");

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
    type: z.enum(GAME_TYPE_VALUES),
    platformId: z.string().cuid(),
    currency: currencySchema,
    startedAt: dateSchema,
    endedAt: optionalDateSchema,
    buyIn: moneySchema,
    cashOut: optionalMoneySchema,
    notes: z.string().trim().max(500).optional(),
    isRunning: z.enum(["true", "false"]).default("false"),
  })
  .superRefine((value, context) => {
    if (value.isRunning === "true") return;
    if (!value.endedAt) {
      context.addIssue({ code: "custom", path: ["endedAt"], message: "Endzeit fehlt." });
    }
    if (value.cashOut === undefined) {
      context.addIssue({ code: "custom", path: ["cashOut"], message: "Cash-out fehlt." });
    }
    if (
      value.endedAt instanceof Date &&
      value.endedAt.getTime() <= value.startedAt.getTime()
    ) {
      context.addIssue({
        code: "custom",
        path: ["endedAt"],
        message: "Das Ende muss nach dem Start liegen.",
      });
    }
  });

export const platformSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Mindestens 2 Zeichen.")
    .max(50, "Höchstens 50 Zeichen."),
});

export const transactionSchema = z.object({
  type: z.enum(["STARTING_BALANCE", "DEPOSIT", "WITHDRAWAL"]),
  amount: moneySchema.positive("Der Betrag muss größer als 0 sein."),
  currency: currencySchema,
  occurredAt: dateSchema,
  note: z.string().trim().max(200).optional(),
});

export const settingsSchema = z.object({
  defaultCurrency: currencySchema,
});
