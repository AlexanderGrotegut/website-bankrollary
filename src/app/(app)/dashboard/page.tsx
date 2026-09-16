import { Activity, Clock3, Percent, Plus, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";
import { BankrollChart } from "@/components/dashboard/BankrollChart";
import { PerformanceBreakdowns } from "@/components/dashboard/PerformanceBreakdowns";
import { buildAnalytics, periodStart, type Period } from "@/lib/analytics";
import { requireUser } from "@/lib/auth";
import { buildBreakdowns } from "@/lib/breakdowns";
import { calculateSessionMetrics } from "@/lib/calculations";
import { formatDuration, formatMoney } from "@/lib/domain";
import { prisma } from "@/lib/prisma";

const periods: { value: Period; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
  { value: "all", label: "All time" },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; currency?: string }>;
}) {
  const user = await requireUser();
  const query = await searchParams;
  const period = periods.some(({ value }) => value === query.period)
    ? (query.period as Period)
    : "month";
  const [settings, sessions, transactions] = await Promise.all([
    prisma.userSettings.findUniqueOrThrow({ where: { userId: user.id } }),
    prisma.session.findMany({
      where: { userId: user.id },
      include: {
        platform: { select: { name: true } },
        gameCategory: { select: { name: true } },
      },
      orderBy: { startedAt: "desc" },
    }),
    prisma.bankrollTransaction.findMany({ where: { userId: user.id } }),
  ]);
  const analytics = buildAnalytics(
    sessions.map((session) => ({
      ...session,
      buyIn: Number(session.buyIn),
      cashOut: session.cashOut === null ? null : Number(session.cashOut),
      convertedCurrency: session.convertedCurrency,
      convertedBuyIn:
        session.convertedBuyIn === null ? null : Number(session.convertedBuyIn),
      convertedCashOut:
        session.convertedCashOut === null ? null : Number(session.convertedCashOut),
      convertedProfit:
        session.convertedProfit === null ? null : Number(session.convertedProfit),
    })),
    transactions.map((transaction) => ({
      ...transaction,
      amount: Number(transaction.amount),
    })),
    period,
    settings.defaultCurrency,
  );
  const selected =
    analytics.find(({ currency }) => currency === query.currency) ??
    analytics.find(({ currency }) => currency === settings.defaultCurrency) ??
    analytics[0];
  if (!selected) throw new Error("Analytics could not be generated.");
  const breakdowns = buildBreakdowns(
    sessions
      .filter((session) =>
        session.convertedProfit !== null && session.convertedCurrency
          ? session.convertedCurrency === selected.currency
          : session.currency === selected.currency,
      )
      .map((session) => ({
        ...session,
        buyIn:
          session.convertedBuyIn === null
            ? Number(session.buyIn)
            : Number(session.convertedBuyIn),
        cashOut:
          session.convertedCashOut === null
            ? session.cashOut === null ? null : Number(session.cashOut)
            : Number(session.convertedCashOut),
      })),
    periodStart(period),
  );

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Performance center</p>
          <h1>Your bankroll at a glance</h1>
          <p>Understand results, spot trends and stay focused.</p>
        </div>
        <Link href="/sessions/neu" className="button-primary">
          <Plus size={18} /> New session
        </Link>
      </header>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="segmented">
          {periods.map(({ value, label }) => (
            <Link
              className={period === value ? "active" : ""}
              href={`?period=${value}&currency=${selected.currency}`}
              key={value}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex gap-2">
          {analytics.map(({ currency }) => (
            <Link
              className={`currency-chip ${currency === selected.currency ? "active" : ""}`}
              href={`?period=${period}&currency=${currency}`}
              key={currency}
            >
              {currency}
            </Link>
          ))}
        </div>
      </div>

      <section className="metric-grid mt-6">
        <Metric icon={Wallet} label="Current bankroll" value={formatMoney(selected.bankroll, selected.currency)} />
        <Metric icon={TrendingUp} label="Profit / loss" value={formatMoney(selected.profit, selected.currency)} tone={selected.profit} />
        <Metric icon={Percent} label="ROI" value={selected.roi === null ? "—" : `${selected.roi.toFixed(1)} %`} tone={selected.roi} />
        <Metric icon={Clock3} label="Hourly rate" value={selected.hourlyRate === null ? "—" : formatMoney(selected.hourlyRate, selected.currency)} tone={selected.hourlyRate} />
        <Metric icon={Activity} label="Sessions" value={String(selected.sessionCount)} detail={formatDuration(selected.durationMinutes)} />
      </section>

      <section className="panel mt-6">
        <div className="panel-heading">
          <div>
            <h2>Bankroll development</h2>
            <p>Cumulative balance including bankroll transactions</p>
          </div>
          <span className="currency-chip active">{selected.currency}</span>
        </div>
        <BankrollChart data={selected.chart} currency={selected.currency} />
      </section>
      <PerformanceBreakdowns {...breakdowns} currency={selected.currency} />

      <section className="panel mt-6">
        <div className="panel-heading">
          <div><h2>Recent sessions</h2><p>Your latest activity</p></div>
          <Link href="/sessions" className="text-link">View all</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Type</th><th>Platform</th><th>Date</th><th>Duration</th><th>P/L</th></tr></thead>
            <tbody>
              {sessions.slice(0, 5).map((session) => {
                const metrics = calculateSessionMetrics({
                  ...session,
                  buyIn: Number(session.buyIn),
                  cashOut: session.cashOut === null ? null : Number(session.cashOut),
                });
                return (
                  <tr key={session.id}>
                    <td>{session.gameCategory.name}</td>
                    <td>{session.platform.name}</td>
                    <td>{session.startedAt.toLocaleDateString("en-GB")}</td>
                    <td>{metrics.durationMinutes === null ? "Running" : formatDuration(metrics.durationMinutes)}</td>
                    <td className={toneClass(metrics.profit)}>{metrics.profit === null ? "—" : formatMoney(metrics.profit, session.currency)}</td>
                  </tr>
                );
              })}
              {!sessions.length && <tr><td colSpan={5} className="empty-row">No sessions recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function toneClass(value: number | null) {
  if (value === null || value === 0) return "";
  return value > 0 ? "positive" : "negative";
}

function Metric({ icon: Icon, label, value, detail, tone }: { icon: typeof Wallet; label: string; value: string; detail?: string; tone?: number | null }) {
  return <article className="metric-card"><span className="metric-icon"><Icon size={19} /></span><div><p>{label}</p><strong className={toneClass(tone ?? null)}>{value}</strong>{detail && <small>{detail}</small>}</div></article>;
}
