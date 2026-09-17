export type SessionNumbers = {
  buyIn: number;
  cashOut: number | null;
  startedAt: Date;
  endedAt: Date | null;
};

export type SessionMetrics = {
  profit: number | null;
  durationMinutes: number | null;
  roi: number | null;
  hourlyRate: number | null;
};

export function calculateSessionMetrics(session: SessionNumbers): SessionMetrics {
  if (session.cashOut === null || session.endedAt === null) {
    return { profit: null, durationMinutes: null, roi: null, hourlyRate: null };
  }

  const durationMinutes = Math.max(
    0,
    (session.endedAt.getTime() - session.startedAt.getTime()) / 60_000,
  );
  const profit = session.cashOut - session.buyIn;
  const roi = session.buyIn > 0 ? (profit / session.buyIn) * 100 : null;
  const hourlyRate =
    durationMinutes > 0 ? profit / (durationMinutes / 60) : null;

  return { profit, durationMinutes, roi, hourlyRate };
}

export function signedTransactionAmount(
  type: "STARTING_BALANCE" | "DEPOSIT" | "WITHDRAWAL",
  amount: number,
) {
  return type === "WITHDRAWAL" ? -amount : amount;
}

export function calculateWeightedRoi(profit: number, totalBuyIn: number) {
  return totalBuyIn > 0 ? (profit / totalBuyIn) * 100 : null;
}
