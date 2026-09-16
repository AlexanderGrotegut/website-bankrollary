import { prisma } from "@/lib/prisma";

export function ensureUserSettings(userId: string) {
  return prisma.userSettings.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}
