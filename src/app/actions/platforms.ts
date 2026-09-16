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
  if (existing) {
    return { error: "This platform already exists." };
  }
  await prisma.platform.create({
    data: { userId: user.id, name: parsed.data.name },
  });

  revalidatePath("/sessions");
  revalidatePath("/einstellungen");
  return { success: "Platform saved." };
}

export async function deletePlatformAction(formData: FormData) {
  const user = await requireUser();
  const id = z.string().cuid().safeParse(formData.get("id"));
  if (!id.success) return;

  await prisma.platform.deleteMany({
    where: { id: id.data, userId: user.id },
  });
  revalidatePath("/sessions");
  revalidatePath("/einstellungen");
}
