import { PlatformForm } from "@/components/settings/PlatformForm";
import { SessionForm } from "@/components/sessions/SessionForm";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function NewSessionPage() {
  const user = await requireUser();
  const [platforms, settings] = await Promise.all([
    prisma.platform.findMany({
      where: { userId: user.id, archivedAt: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.userSettings.findUniqueOrThrow({ where: { userId: user.id } }),
  ]);

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Session erfassen</p>
          <h1>Was hast du gespielt?</h1>
          <p>P/L, ROI, Dauer und Stundenlohn werden automatisch berechnet.</p>
        </div>
      </header>
      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="panel">
          <SessionForm platforms={platforms} defaultCurrency={settings.defaultCurrency} />
        </section>
        <aside className="panel self-start">
          <h2>Plattform fehlt?</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Lege eigene Anbieter oder Spielorte an.</p>
          <div className="mt-5"><PlatformForm /></div>
        </aside>
      </div>
    </>
  );
}
