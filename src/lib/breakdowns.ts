import { calculateSessionMetrics } from "@/lib/calculations";

type BreakdownSession = {
  buyIn: number;
  cashOut: number | null;
  startedAt: Date;
  endedAt: Date | null;
  gameCategoryName: string;
  platformName: string;
};

export type BreakdownRow = {
  label: string;
  profit: number;
  sessions: number;
};

export function buildBreakdowns(
  sessions: BreakdownSession[],
  start: Date,
) {
  const completed = sessions.filter(
    (session) => session.endedAt && session.endedAt >= start,
  );
  return {
    types: group(completed, (session) => session.gameCategoryName),
    platforms: group(completed, (session) => session.platformName),
  };
}

function group(
  sessions: BreakdownSession[],
  labelFor: (session: BreakdownSession) => string,
) {
  const groups = new Map<string, BreakdownRow>();
  sessions.forEach((session) => {
    const label = labelFor(session);
    const current = groups.get(label) ?? { label, profit: 0, sessions: 0 };
    const { profit } = calculateSessionMetrics(session);
    groups.set(label, {
      label,
      profit: current.profit + (profit ?? 0),
      sessions: current.sessions + 1,
    });
  });
  return [...groups.values()].sort(
    (first, second) => second.profit - first.profit,
  );
}
