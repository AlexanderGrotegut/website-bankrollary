import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export async function enforceRateLimit(scope: string, values: string[]) {
  const key = createHash("sha256")
    .update([scope, ...values].join(":"))
    .digest("hex");
  const windowStart = new Date(Date.now() - WINDOW_MS);

  const allowed = await prisma.$transaction(async (database) => {
    const current = await database.rateLimitEntry.findUnique({ where: { key } });

    if (!current || current.windowStart < windowStart) {
      await database.rateLimitEntry.upsert({
        where: { key },
        create: { key },
        update: { count: 1, windowStart: new Date() },
      });
      return true;
    }

    if (current.count >= MAX_ATTEMPTS) return false;
    await database.rateLimitEntry.update({
      where: { key },
      data: { count: { increment: 1 } },
    });
    return true;
  });

  if (!allowed) throw new Error("Zu viele Versuche. Bitte warte 15 Minuten.");
}
