import { GameCategoryForm } from "@/components/settings/GameCategoryForm";
import { PlatformForm } from "@/components/settings/PlatformForm";
import { SessionForm } from "@/components/sessions/SessionForm";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function NewSessionPage() {
  const user = await requireUser();
  const [platforms, gameCategories, settings] = await Promise.all([
    prisma.platform.findMany({
      where: { userId: user.id, archivedAt: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.gameCategory.findMany({
      where: {
        archivedAt: null,
        OR: [{ userId: null }, { userId: user.id }],
      },
      orderBy: [{ userId: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
    prisma.userSettings.findUniqueOrThrow({ where: { userId: user.id } }),
  ]);

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Track a session</p>
          <h1>What did you play?</h1>
          <p>P/L, ROI, duration and hourly rate are calculated automatically.</p>
        </div>
      </header>
      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="panel">
          <SessionForm platforms={platforms} gameCategories={gameCategories} defaultCurrency={settings.defaultCurrency} />
        </section>
        <aside className="panel self-start">
          <h2>Missing a platform?</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Add your own provider or venue.</p>
          <div className="mt-5"><PlatformForm /></div>
          <div className="my-6 border-t border-[var(--border)]" />
          <h2>Missing a game type?</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Create a private game type that only you can select.
          </p>
          <div className="mt-5"><GameCategoryForm /></div>
        </aside>
      </div>
    </>
  );
}
