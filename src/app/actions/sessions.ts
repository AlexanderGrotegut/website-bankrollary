"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { buildSessionSnapshot } from "@/lib/exchangeRates";
import { prisma } from "@/lib/prisma";
import { sessionSchema } from "@/lib/validation";

export type FormState = { error?: string; success?: string };

function refreshSessionPages() {
  revalidatePath("/dashboard");
  revalidatePath("/sessions");
}

function normalizeLocalDateTimes(formData: FormData) {
  const offset = z.coerce
    .number()
    .int()
    .min(-840)
    .max(840)
    .safeParse(formData.get("timezoneOffset"));
  if (!offset.success) return false;

  for (const field of ["startedAt", "endedAt"]) {
    const value = formData.get(field);
    if (typeof value !== "string" || value === "") continue;
    const parts = value.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/,
    );
    if (!parts) return false;
    const [, year, month, day, hours, minutes] = parts;
    const utcTime =
      Date.UTC(+year, +month - 1, +day, +hours, +minutes) +
      offset.data * 60_000;
    formData.set(field, new Date(utcTime).toISOString());
  }
  return true;
}

export async function saveSessionAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  if (!normalizeLocalDateTimes(formData)) {
    return { error: "Enter a valid date and time." };
  }
  const parsed = sessionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your input." };
  }

  const [platform, settings, existing] = await Promise.all([
    prisma.platform.findFirst({
      where: { id: parsed.data.platformId, userId: user.id, archivedAt: null },
      select: { id: true, name: true },
    }),
    prisma.userSettings.findUniqueOrThrow({ where: { userId: user.id } }),
    parsed.data.id
      ? prisma.session.findFirst({
          where: { id: parsed.data.id, userId: user.id },
        })
      : null,
  ]);
  if (!platform) return { error: "Platform not found." };
  if (parsed.data.id && !existing) return { error: "Session not found." };

  const gameCategory = await prisma.gameCategory.findFirst({
    where: {
      id: parsed.data.gameCategoryId,
      OR: [
        { userId: user.id },
        {
          userId: null,
          ...(existing?.gameCategoryId === parsed.data.gameCategoryId
            ? {}
            : { hiddenFor: { none: { userId: user.id } } }),
        },
      ],
      ...(existing?.gameCategoryId === parsed.data.gameCategoryId
        ? {}
        : { archivedAt: null }),
    },
    select: { id: true, name: true },
  });
  if (!gameCategory) return { error: "Game type not found." };

  const running = parsed.data.isRunning === "true";
  const endedAt = running ? null : parsed.data.endedAt ?? null;
  const cashOut = running ? null : parsed.data.cashOut ?? null;
  let snapshot;
  try {
    snapshot = await buildSessionSnapshot({
      enabled: parsed.data.convertToDefaultCurrency === "true",
      sourceCurrency: parsed.data.currency,
      targetCurrency: settings.defaultCurrency,
      buyIn: parsed.data.buyIn,
      cashOut,
      completedAt: endedAt,
      existing: existing
        ? {
            currency: existing.currency,
            exchangeRate:
              existing.exchangeRate === null ? null : Number(existing.exchangeRate),
            exchangeRateDate: existing.exchangeRateDate,
            convertedCurrency: existing.convertedCurrency,
          }
        : undefined,
    });
  } catch {
    return {
      error:
        "The exchange rate could not be loaded. Your session was not saved. Please try again.",
    };
  }

  const data = {
    gameCategoryId: gameCategory.id,
    gameCategoryName: gameCategory.name,
    platformId: platform.id,
    platformName: platform.name,
    currency: parsed.data.currency,
    startedAt: parsed.data.startedAt,
    endedAt,
    buyIn: parsed.data.buyIn,
    cashOut,
    notes: parsed.data.notes || null,
    ...snapshot,
  };
  if (existing) {
    await prisma.session.update({ where: { id: existing.id }, data });
  } else {
    await prisma.session.create({ data: { ...data, userId: user.id } });
  }

  refreshSessionPages();
  return { success: existing ? "Session updated." : "Session saved." };
}

export async function finishSessionAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = z
    .object({
      id: z.string().cuid(),
      cashOut: z.coerce.number().min(0).max(999_999_999),
      timezoneOffset: z.coerce.number().int().min(-840).max(840),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid cash-out." };

  const [session, settings] = await Promise.all([
    prisma.session.findFirst({
      where: { id: parsed.data.id, userId: user.id, endedAt: null },
    }),
    prisma.userSettings.findUniqueOrThrow({ where: { userId: user.id } }),
  ]);
  if (!session) return { error: "Running session not found." };

  const endedAt = new Date();
  const correctedStartedAt = new Date(
    session.startedAt.getTime() + parsed.data.timezoneOffset * 60_000,
  );
  const startedAt =
    session.startedAt > endedAt ? correctedStartedAt : session.startedAt;
  if (startedAt >= endedAt) {
    return { error: "The session start time is in the future. Edit it before completing." };
  }
  let snapshot;
  try {
    snapshot = await buildSessionSnapshot({
      enabled: session.convertToDefaultCurrency,
      sourceCurrency: session.currency,
      targetCurrency: settings.defaultCurrency,
      buyIn: Number(session.buyIn),
      cashOut: parsed.data.cashOut,
      completedAt: endedAt,
    });
  } catch {
    return { error: "The exchange rate is unavailable. Please try again." };
  }

  await prisma.session.update({
    where: { id: session.id },
    data: { startedAt, endedAt, cashOut: parsed.data.cashOut, ...snapshot },
  });
  refreshSessionPages();
  return { success: "Session completed." };
}

export async function deleteSessionAction(formData: FormData) {
  const user = await requireUser();
  const id = z.string().cuid().safeParse(formData.get("id"));
  if (!id.success) return;
  await prisma.session.deleteMany({ where: { id: id.data, userId: user.id } });
  refreshSessionPages();
}
