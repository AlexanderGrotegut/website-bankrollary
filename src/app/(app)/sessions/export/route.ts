import { getUser } from "@/lib/auth";
import { calculateSessionMetrics } from "@/lib/calculations";
import { GAME_TYPE_LABELS } from "@/lib/domain";
import { prisma } from "@/lib/prisma";

function csvCell(value: string | number | null) {
  if (value === null) return "";
  const text = String(value);
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export async function GET() {
  const user = await getUser();
  if (!user) return new Response("Nicht autorisiert.", { status: 401 });

  const sessions = await prisma.session.findMany({
    where: { userId: user.id },
    include: { platform: { select: { name: true } } },
    orderBy: { startedAt: "desc" },
  });
  const header = [
    "Typ", "Plattform", "Währung", "Start", "Ende", "Buy-in",
    "Cash-out", "P/L", "Dauer (Min.)", "ROI (%)", "Stundenlohn", "Notiz",
  ];
  const rows = sessions.map((session) => {
    const metrics = calculateSessionMetrics({
      ...session,
      buyIn: Number(session.buyIn),
      cashOut: session.cashOut === null ? null : Number(session.cashOut),
    });
    return [
      GAME_TYPE_LABELS[session.type],
      session.platform.name,
      session.currency,
      session.startedAt.toISOString(),
      session.endedAt?.toISOString() ?? null,
      Number(session.buyIn),
      session.cashOut === null ? null : Number(session.cashOut),
      metrics.profit,
      metrics.durationMinutes,
      metrics.roi,
      metrics.hourlyRate,
      session.notes,
    ];
  });
  const csv = [header, ...rows]
    .map((row) => row.map(csvCell).join(";"))
    .join("\r\n");

  return new Response(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bankrollary-sessions.csv"',
      "Cache-Control": "private, no-store",
    },
  });
}
