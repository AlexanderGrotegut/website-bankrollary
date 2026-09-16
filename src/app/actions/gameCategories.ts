"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { FormState } from "@/app/actions/sessions";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const categorySchema = z.object({
  name: z.string().trim().min(2, "At least 2 characters.").max(40),
});

function normalizeName(name: string) {
  return name.normalize("NFKC").toLocaleLowerCase("en");
}

export async function createGameCategoryAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid name." };
  }

  const normalizedName = normalizeName(parsed.data.name);
  const existing = await prisma.gameCategory.findFirst({
    where: {
      normalizedName,
      OR: [{ userId: null }, { userId: user.id }],
    },
  });
  if (existing?.userId === null) {
    return { error: "This built-in game type already exists." };
  }
  if (existing) {
    return { error: "You already created this game type." };
  }
  await prisma.gameCategory.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      normalizedName,
    },
  });

  revalidatePath("/sessions");
  revalidatePath("/einstellungen");
  return { success: "Game type saved." };
}

export async function deleteGameCategoryAction(formData: FormData) {
  const user = await requireUser();
  const id = z.string().cuid().safeParse(formData.get("id"));
  if (!id.success) return;

  await prisma.gameCategory.deleteMany({
    where: { id: id.data, userId: user.id },
  });
  revalidatePath("/sessions");
  revalidatePath("/einstellungen");
}
