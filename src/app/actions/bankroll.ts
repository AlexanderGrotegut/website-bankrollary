"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { settingsSchema, transactionSchema } from "@/lib/validation";
import type { FormState } from "@/app/actions/sessions";

export async function saveTransactionAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = transactionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Buchung." };
  }

  await prisma.bankrollTransaction.create({
    data: { ...parsed.data, note: parsed.data.note || null, userId: user.id },
  });
  revalidatePath("/dashboard");
  revalidatePath("/einstellungen");
  return { success: "Buchung gespeichert." };
}

export async function deleteTransactionAction(formData: FormData) {
  const user = await requireUser();
  const id = z.string().cuid().safeParse(formData.get("id"));
  if (!id.success) return;

  await prisma.bankrollTransaction.deleteMany({
    where: { id: id.data, userId: user.id },
  });
  revalidatePath("/dashboard");
  revalidatePath("/einstellungen");
}

export async function saveSettingsAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Ungültige Standardwährung." };

  await prisma.userSettings.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...parsed.data },
    update: parsed.data,
  });
  revalidatePath("/dashboard");
  revalidatePath("/sessions");
  revalidatePath("/einstellungen");
  return { success: "Einstellungen gespeichert." };
}
