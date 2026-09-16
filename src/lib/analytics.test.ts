import { describe, expect, it } from "vitest";
import { buildAnalytics } from "@/lib/analytics";

describe("buildAnalytics", () => {
  it("keeps currencies separate and excludes transfers from P/L", () => {
    const sessions = [
      {
        buyIn: 100,
        cashOut: 150,
        currency: "EUR",
        startedAt: new Date("2026-09-15T10:00:00Z"),
        endedAt: new Date("2026-09-15T12:00:00Z"),
      },
      {
        buyIn: 100,
        cashOut: 80,
        currency: "USD",
        startedAt: new Date("2026-09-15T10:00:00Z"),
        endedAt: new Date("2026-09-15T11:00:00Z"),
      },
    ];
    const transactions = [
      {
        amount: 500,
        currency: "EUR",
        occurredAt: new Date("2026-09-01T10:00:00Z"),
        type: "STARTING_BALANCE" as const,
      },
    ];

    const result = buildAnalytics(sessions, transactions, "all", "EUR");
    const euro = result.find(({ currency }) => currency === "EUR");
    const dollar = result.find(({ currency }) => currency === "USD");

    expect(euro?.bankroll).toBe(550);
    expect(euro?.profit).toBe(50);
    expect(dollar?.bankroll).toBe(-20);
    expect(dollar?.profit).toBe(-20);
  });

  it("counts a converted session only in its snapshot currency", () => {
    const result = buildAnalytics(
      [
        {
          buyIn: 100,
          cashOut: 150,
          currency: "USD",
          startedAt: new Date("2026-09-15T10:00:00Z"),
          endedAt: new Date("2026-09-15T12:00:00Z"),
          convertedCurrency: "EUR",
          convertedBuyIn: 85,
          convertedCashOut: 127.5,
          convertedProfit: 42.5,
        },
      ],
      [],
      "all",
      "EUR",
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.currency).toBe("EUR");
    expect(result[0]?.profit).toBe(42.5);
    expect(result[0]?.bankroll).toBe(42.5);
  });

  it("allows withdrawals to create a negative bankroll", () => {
    const result = buildAnalytics(
      [],
      [
        {
          amount: 200,
          currency: "EUR",
          occurredAt: new Date("2026-09-16T10:00:00Z"),
          type: "WITHDRAWAL",
        },
      ],
      "all",
      "EUR",
    );

    expect(result[0]?.bankroll).toBe(-200);
    expect(result[0]?.profit).toBe(0);
    expect(result[0]?.chart.at(-1)?.value).toBe(-200);
  });
});
