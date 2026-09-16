import { Download, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteSessionAction } from "@/app/actions/sessions";
import { FinishSessionForm } from "@/components/sessions/FinishSessionForm";
import { requireUser } from "@/lib/auth";
import { calculateSessionMetrics } from "@/lib/calculations";
import {
  CURRENCIES,
  formatDuration,
  formatMoney,
  GAME_TYPE_LABELS,
  GAME_TYPES,
} from "@/lib/domain";
import { prisma } from "@/lib/prisma";

type Query = {
  search?: string;
  type?: string;
  currency?: string;
  platform?: string;
  from?: string;
  to?: string;
};

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const user = await requireUser();
  const query = await searchParams;
  const [sessions, platforms] = await Promise.all([
    prisma.session.findMany({
      where: { userId: user.id },
      include: { platform: { select: { name: true } } },
      orderBy: { startedAt: "desc" },
    }),
    prisma.platform.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  const search = query.search?.trim().toLocaleLowerCase("de") ?? "";
  const filtered = sessions.filter((session) => {
    const haystack = `${session.platform.name} ${session.notes ?? ""}`.toLocaleLowerCase("de");
    if (search && !haystack.includes(search)) return false;
    if (query.type && session.type !== query.type) return false;
    if (query.currency && session.currency !== query.currency) return false;
    if (query.platform && session.platformId !== query.platform) return false;
    if (query.from && session.startedAt < new Date(`${query.from}T00:00:00`)) return false;
    if (query.to && session.startedAt > new Date(`${query.to}T23:59:59`)) return false;
    return true;
  });

  return (
    <>
      <header className="page-header">
        <div><p className="eyebrow">Session-Archiv</p><h1>Alle Sessions</h1><p>Durchsuche, filtere und bearbeite deine Historie.</p></div>
        <div className="flex gap-3">
          <Link href="/sessions/export" className="button-secondary"><Download size={17} /> CSV</Link>
          <Link href="/sessions/neu" className="button-primary"><Plus size={18} /> Neue Session</Link>
        </div>
      </header>

      <form className="panel filter-grid mt-8">
        <label className="field"><span>Suche</span><input name="search" defaultValue={query.search} placeholder="Plattform oder Notiz" /></label>
        <label className="field"><span>Typ</span><select name="type" defaultValue={query.type}><option value="">Alle</option>{GAME_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="field"><span>Plattform</span><select name="platform" defaultValue={query.platform}><option value="">Alle</option>{platforms.map((platform) => <option key={platform.id} value={platform.id}>{platform.name}</option>)}</select></label>
        <label className="field"><span>Währung</span><select name="currency" defaultValue={query.currency}><option value="">Alle</option>{CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}</select></label>
        <label className="field"><span>Von</span><input name="from" type="date" defaultValue={query.from} /></label>
        <label className="field"><span>Bis</span><input name="to" type="date" defaultValue={query.to} /></label>
        <button className="button-secondary self-end">Filtern</button>
        <Link href="/sessions" className="text-link self-center">Zurücksetzen</Link>
      </form>

      <section className="panel mt-6">
        <div className="panel-heading"><div><h2>{filtered.length} Sessions</h2><p>Abgeschlossene und laufende Sessions</p></div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Session</th><th>Zeitraum</th><th>Buy-in / Cash-out</th><th>Ergebnis</th><th>ROI / Std.</th><th className="text-right">Aktion</th></tr></thead>
            <tbody>
              {filtered.map((session) => {
                const metrics = calculateSessionMetrics({
                  ...session,
                  buyIn: Number(session.buyIn),
                  cashOut: session.cashOut === null ? null : Number(session.cashOut),
                });
                const tone = metrics.profit === null || metrics.profit === 0 ? "" : metrics.profit > 0 ? "positive" : "negative";
                return (
                  <tr key={session.id}>
                    <td><strong>{GAME_TYPE_LABELS[session.type]}</strong><small>{session.platform.name}</small></td>
                    <td>{session.startedAt.toLocaleDateString("de-DE")}<small>{metrics.durationMinutes === null ? <span className="status-live">Läuft</span> : formatDuration(metrics.durationMinutes)}</small></td>
                    <td>{formatMoney(Number(session.buyIn), session.currency)}<small>{session.cashOut === null ? "Cash-out offen" : formatMoney(Number(session.cashOut), session.currency)}</small></td>
                    <td className={tone}>{metrics.profit === null ? "—" : formatMoney(metrics.profit, session.currency)}</td>
                    <td>{metrics.roi === null ? "—" : `${metrics.roi.toFixed(1)} %`}<small>{metrics.hourlyRate === null ? "—" : `${formatMoney(metrics.hourlyRate, session.currency)} / h`}</small></td>
                    <td>
                      {session.endedAt ? (
                        <div className="row-actions">
                          <Link href={`/sessions/${session.id}`} title="Bearbeiten"><Pencil size={16} /></Link>
                          <form action={deleteSessionAction}><input type="hidden" name="id" value={session.id} /><button title="Löschen"><Trash2 size={16} /></button></form>
                        </div>
                      ) : <FinishSessionForm id={session.id} />}
                    </td>
                  </tr>
                );
              })}
              {!filtered.length && <tr><td colSpan={6} className="empty-row">Keine passenden Sessions gefunden.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
