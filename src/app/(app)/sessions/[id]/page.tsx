import { notFound } from "next/navigation";
import { SessionForm } from "@/components/sessions/SessionForm";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function dateTimeValue(value: Date | null) {
  if (!value) return "";
  return value.toISOString().slice(0, 16);
}

export default async function EditSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const [session, platforms, gameCategories, settings] = await Promise.all([
    prisma.session.findFirst({ where: { id, userId: user.id } }),
    prisma.platform.findMany({
      where: { userId: user.id, archivedAt: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.gameCategory.findMany({
      where: {
        OR: [
          { archivedAt: null, userId: null },
          { archivedAt: null, userId: user.id },
          { sessions: { some: { id, userId: user.id } } },
        ],
      },
      orderBy: [{ userId: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
    prisma.userSettings.findUniqueOrThrow({ where: { userId: user.id } }),
  ]);
  if (!session) notFound();

  return (
    <>
      <header className="page-header">
        <div><p className="eyebrow">Edit session</p><h1>Update your entry</h1><p>All metrics will be recalculated.</p></div>
      </header>
      <section className="panel mt-8">
        <SessionForm
          platforms={platforms}
          gameCategories={gameCategories}
          defaultCurrency={settings.defaultCurrency}
          session={{
            id: session.id,
            gameCategoryId: session.gameCategoryId ?? "",
            platformId: session.platformId ?? "",
            currency: session.currency,
            startedAt: dateTimeValue(session.startedAt),
            endedAt: dateTimeValue(session.endedAt),
            buyIn: Number(session.buyIn),
            cashOut: session.cashOut === null ? null : Number(session.cashOut),
            notes: session.notes ?? "",
            convertToDefaultCurrency: session.convertToDefaultCurrency,
            exchangeRate:
              session.exchangeRate === null ? null : Number(session.exchangeRate),
            convertedCurrency: session.convertedCurrency,
          }}
        />
      </section>
    </>
  );
}
