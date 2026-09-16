"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { platformSchema } from "@/lib/validation";
import type { FormState } from "@/app/actions/sessions";

export async function createPlatformAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = platformSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid name." };
  }

  const existing = await prisma.platform.findFirst({
    where: {
      userId: user.id,
      name: { equals: parsed.data.name, mode: "insensitive" },
    },
  });
  if (existing?.archivedAt) {
    await prisma.platform.update({
      where: { id: existing.id },
      data: { archivedAt: null },
    });
  } else if (existing) {
    return { error: "This platform already exists." };
  } else {
    await prisma.platform.create({
      data: { userId: user.id, name: parsed.data.name },
    });
  }

  revalidatePath("/sessions");
  revalidatePath("/einstellungen");
  return { success: "Platform saved." };
}

export async function archivePlatformAction(formData: FormData) {
  const user = await requireUser();
  const id = z.string().cuid().safeParse(formData.get("id"));
  if (!id.success) return;

  await prisma.platform.updateMany({
    where: { id: id.data, userId: user.id },
    data: { archivedAt: new Date() },
  });
  revalidatePath("/sessions");
  revalidatePath("/einstellungen");
}
