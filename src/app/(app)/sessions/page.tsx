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
} from "@/lib/domain";
import { prisma } from "@/lib/prisma";

type Query = {
  search?: string;
  category?: string;
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
  const [sessions, gameCategories, platforms] = await Promise.all([
    prisma.session.findMany({
      where: { userId: user.id },
      orderBy: { startedAt: "desc" },
    }),
    prisma.gameCategory.findMany({
      where: {
        archivedAt: null,
        OR: [
          { userId: user.id },
          {
            userId: null,
            hiddenFor: { none: { userId: user.id } },
          },
        ],
      },
      orderBy: [{ userId: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
    prisma.platform.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  const search = query.search?.trim().toLocaleLowerCase("en") ?? "";
  const filtered = sessions
    .filter((session) => {
      const haystack = `${session.platformName} ${session.notes ?? ""}`.toLocaleLowerCase("en");
      if (search && !haystack.includes(search)) return false;
      if (query.category && session.gameCategoryId !== query.category) return false;
      if (query.currency && session.currency !== query.currency) return false;
      if (query.platform && session.platformId !== query.platform) return false;
      if (query.from && session.startedAt < new Date(`${query.from}T00:00:00`)) return false;
      if (query.to && session.startedAt > new Date(`${query.to}T23:59:59`)) return false;
      return true;
    })
    .sort((first, second) => {
      if (first.endedAt === null && second.endedAt !== null) return -1;
      if (first.endedAt !== null && second.endedAt === null) return 1;
      return second.startedAt.getTime() - first.startedAt.getTime();
    });

  return (
    <>
      <header className="page-header">
        <div><p className="eyebrow">Session archive</p><h1>All sessions</h1><p>Search, filter and edit your history.</p></div>
        <div className="flex gap-3">
          <Link href="/sessions/export" className="button-secondary" prefetch={false}><Download size={17} /> CSV</Link>
          <Link href="/sessions/neu" className="button-primary" prefetch={false}><Plus size={18} /> New session</Link>
        </div>
      </header>

      <form className="panel filter-grid mt-8">
        <label className="field"><span>Search</span><input name="search" defaultValue={query.search} placeholder="Platform or notes" /></label>
        <label className="field"><span>Game type</span><select name="category" defaultValue={query.category}><option value="">All</option>{gameCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label className="field"><span>Platform</span><select name="platform" defaultValue={query.platform}><option value="">All</option>{platforms.map((platform) => <option key={platform.id} value={platform.id}>{platform.name}</option>)}</select></label>
        <label className="field"><span>Currency</span><select name="currency" defaultValue={query.currency}><option value="">All</option>{CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}</select></label>
        <label className="field"><span>From</span><input name="from" type="date" defaultValue={query.from} /></label>
        <label className="field"><span>To</span><input name="to" type="date" defaultValue={query.to} /></label>
        <button className="button-secondary self-end">Apply filters</button>
        <Link href="/sessions" className="text-link self-center" prefetch={false}>Reset</Link>
      </form>

      <section className="panel mt-6">
        <div className="panel-heading"><div><h2>{filtered.length} sessions</h2><p>Completed and running sessions</p></div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Session</th><th>Time</th><th>Buy-in / Cash-out</th><th>Result</th><th>ROI / hour</th><th className="text-right">Action</th></tr></thead>
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
                    <td><strong>{session.gameCategoryName}</strong><small>{session.platformName}</small></td>
                    <td>{session.startedAt.toLocaleDateString("en-GB")}<small>{metrics.durationMinutes === null ? <span className="status-live">Running</span> : formatDuration(metrics.durationMinutes)}</small></td>
                    <td>{formatMoney(Number(session.buyIn), session.currency)}<small>{session.cashOut === null ? "Cash-out pending" : formatMoney(Number(session.cashOut), session.currency)}</small></td>
                    <td className={tone}>{metrics.profit === null ? "—" : formatMoney(metrics.profit, session.currency)}{session.convertedProfit !== null && session.convertedCurrency && <small>Locked: {formatMoney(Number(session.convertedProfit), session.convertedCurrency)}</small>}</td>
                    <td>{metrics.roi === null ? "—" : `${metrics.roi.toFixed(1)} %`}<small>{metrics.hourlyRate === null ? "—" : `${formatMoney(metrics.hourlyRate, session.currency)} / h`}</small></td>
                    <td>
                      {session.endedAt ? (
                        <div className="row-actions">
                          <Link href={`/sessions/${session.id}`} title="Edit" prefetch={false}><Pencil size={16} /></Link>
                          <form action={deleteSessionAction}><input type="hidden" name="id" value={session.id} /><button title="Delete"><Trash2 size={16} /></button></form>
                        </div>
                      ) : <FinishSessionForm id={session.id} />}
                    </td>
                  </tr>
                );
              })}
              {!filtered.length && <tr><td colSpan={6} className="empty-row">No matching sessions found.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
