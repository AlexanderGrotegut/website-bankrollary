import type { BreakdownRow } from "@/lib/breakdowns";
import { formatMoney, GAME_TYPE_LABELS } from "@/lib/domain";

export function PerformanceBreakdowns({
  types,
  platforms,
  currency,
}: {
  types: BreakdownRow[];
  platforms: BreakdownRow[];
  currency: string;
}) {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <Breakdown
        title="Nach Spieltyp"
        rows={types.map((row) => ({
          ...row,
          label: GAME_TYPE_LABELS[row.label] ?? row.label,
        }))}
        currency={currency}
      />
      <Breakdown title="Nach Plattform" rows={platforms} currency={currency} />
    </div>
  );
}

function Breakdown({
  title,
  rows,
  currency,
}: {
  title: string;
  rows: BreakdownRow[];
  currency: string;
}) {
  const maximum = Math.max(...rows.map(({ profit }) => Math.abs(profit)), 1);
  return (
    <section className="panel">
      <div className="panel-heading"><div><h2>{title}</h2><p>Performance im gewählten Zeitraum</p></div></div>
      <div className="space-y-4">
        {rows.slice(0, 6).map((row) => (
          <div key={row.label}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span><strong>{row.label}</strong> <small className="text-[var(--muted)]">· {row.sessions}</small></span>
              <strong className={row.profit > 0 ? "positive" : row.profit < 0 ? "negative" : ""}>{formatMoney(row.profit, currency)}</strong>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#edf1f0]">
              <div className={`h-full rounded-full ${row.profit < 0 ? "bg-[#d64d56]" : "bg-[var(--accent)]"}`} style={{ width: `${Math.max(Math.abs(row.profit) / maximum * 100, 3)}%` }} />
            </div>
          </div>
        ))}
        {!rows.length && <p className="empty-row">Noch keine Daten in diesem Zeitraum.</p>}
      </div>
    </section>
  );
}
