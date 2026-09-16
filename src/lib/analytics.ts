import {
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import {
  calculateSessionMetrics,
  calculateWeightedRoi,
  signedTransactionAmount,
} from "@/lib/calculations";

export type Period = "week" | "month" | "year" | "all";

type AnalyticsSession = {
  buyIn: number;
  cashOut: number | null;
  currency: string;
  startedAt: Date;
  endedAt: Date | null;
  convertedCurrency?: string | null;
  convertedBuyIn?: number | null;
  convertedCashOut?: number | null;
  convertedProfit?: number | null;
};

type AnalyticsTransaction = {
  amount: number;
  currency: string;
  occurredAt: Date;
  type: "STARTING_BALANCE" | "DEPOSIT" | "WITHDRAWAL";
};

export type CurrencyAnalytics = {
  currency: string;
  bankroll: number;
  profit: number;
  roi: number | null;
  hourlyRate: number | null;
  durationMinutes: number;
  sessionCount: number;
  chart: { date: string; value: number }[];
};

export function periodStart(period: Period, now = new Date()) {
  if (period === "week") return startOfWeek(now, { weekStartsOn: 1 });
  if (period === "month") return startOfMonth(now);
  if (period === "year") return startOfYear(now);
  return new Date(0);
}

export function buildAnalytics(
  sessions: AnalyticsSession[],
  transactions: AnalyticsTransaction[],
  period: Period,
  defaultCurrency: string,
) {
  const start = periodStart(period);
  const effectiveSessions = sessions.map(toEffectiveSession);
  const currencies = new Set([
    defaultCurrency,
    ...effectiveSessions.map((session) => session.currency),
    ...transactions.map((transaction) => transaction.currency),
  ]);

  return [...currencies].map((currency) =>
    buildCurrencyAnalytics(
      currency,
      effectiveSessions.filter((session) => session.currency === currency),
      transactions.filter((transaction) => transaction.currency === currency),
      start,
    ),
  );
}

function toEffectiveSession(session: AnalyticsSession): AnalyticsSession {
  if (
    !session.convertedCurrency ||
    session.convertedBuyIn === null ||
    session.convertedBuyIn === undefined ||
    session.convertedCashOut === null ||
    session.convertedCashOut === undefined
  ) {
    return session;
  }

  return {
    buyIn: session.convertedBuyIn,
    cashOut: session.convertedCashOut,
    currency: session.convertedCurrency,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
  };
}

function buildCurrencyAnalytics(
  currency: string,
  sessions: AnalyticsSession[],
  transactions: AnalyticsTransaction[],
  start: Date,
): CurrencyAnalytics {
  const sessionEvents = sessions.flatMap((session) => {
    const metrics = calculateSessionMetrics(session);
    return metrics.profit === null || !session.endedAt
      ? []
      : [{ date: session.endedAt, amount: metrics.profit, kind: "session" as const }];
  });
  const transactionEvents = transactions.map((transaction) => ({
    date: transaction.occurredAt,
    amount: signedTransactionAmount(transaction.type, transaction.amount),
    kind: "transaction" as const,
  }));
  const events = [...sessionEvents, ...transactionEvents].sort(
    (first, second) => first.date.getTime() - second.date.getTime(),
  );

  let balance = events
    .filter((event) => event.date < start)
    .reduce((sum, event) => sum + event.amount, 0);
  const chart = [{ date: start.toISOString(), value: balance }];
  events
    .filter((event) => event.date >= start)
    .forEach((event) => {
      balance += event.amount;
      chart.push({ date: event.date.toISOString(), value: balance });
    });

  const periodSessions = sessions.filter(
    (session) => session.endedAt && session.endedAt >= start,
  );
  const totals = periodSessions.reduce(
    (sum, session) => {
      const metrics = calculateSessionMetrics(session);
      return {
        profit: sum.profit + (metrics.profit ?? 0),
        buyIn: sum.buyIn + session.buyIn,
        minutes: sum.minutes + (metrics.durationMinutes ?? 0),
      };
    },
    { profit: 0, buyIn: 0, minutes: 0 },
  );

  return {
    currency,
    bankroll: balance,
    profit: totals.profit,
    roi: calculateWeightedRoi(totals.profit, totals.buyIn),
    hourlyRate: totals.minutes ? totals.profit / (totals.minutes / 60) : null,
    durationMinutes: totals.minutes,
    sessionCount: periodSessions.length,
    chart,
  };
}
