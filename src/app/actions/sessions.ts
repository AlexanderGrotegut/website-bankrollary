"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessionSchema } from "@/lib/validation";

export type FormState = { error?: string; success?: string };

function messageFromIssues(issues: z.core.$ZodIssue[]) {
  return issues[0]?.message ?? "Bitte prüfe deine Eingaben.";
}

export async function saveSessionAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = sessionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: messageFromIssues(parsed.error.issues) };

  const platform = await prisma.platform.findFirst({
    where: { id: parsed.data.platformId, userId: user.id, archivedAt: null },
    select: { id: true },
  });
  if (!platform) return { error: "Die Plattform wurde nicht gefunden." };

  const running = parsed.data.isRunning === "true";
  const endedAt = parsed.data.endedAt instanceof Date ? parsed.data.endedAt : null;
  const cashOut =
    typeof parsed.data.cashOut === "number" ? parsed.data.cashOut : null;
  const sessionData = {
    type: parsed.data.type,
    platformId: platform.id,
    currency: parsed.data.currency,
    startedAt: parsed.data.startedAt,
    endedAt: running ? null : endedAt,
    buyIn: parsed.data.buyIn,
    cashOut: running ? null : cashOut,
    notes: parsed.data.notes || null,
  };

  if (parsed.data.id) {
    const result = await prisma.session.updateMany({
      where: { id: parsed.data.id, userId: user.id },
      data: sessionData,
    });
    if (!result.count) return { error: "Session wurde nicht gefunden." };
  } else {
    await prisma.session.create({
      data: { ...sessionData, userId: user.id },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/sessions");
  return { success: parsed.data.id ? "Session aktualisiert." : "Session gespeichert." };
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
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Bitte gib einen gültigen Cash-out ein." };

  const result = await prisma.session.updateMany({
    where: { id: parsed.data.id, userId: user.id, endedAt: null },
    data: { endedAt: new Date(), cashOut: parsed.data.cashOut },
  });
  if (!result.count) return { error: "Laufende Session wurde nicht gefunden." };

  revalidatePath("/dashboard");
  revalidatePath("/sessions");
  return { success: "Session beendet." };
}

export async function deleteSessionAction(formData: FormData) {
  const user = await requireUser();
  const id = z.string().cuid().safeParse(formData.get("id"));
  if (!id.success) return;

  await prisma.session.deleteMany({ where: { id: id.data, userId: user.id } });
  revalidatePath("/dashboard");
  revalidatePath("/sessions");
}
