import { describe, expect, it } from "vitest";
import {
  buildSessionSnapshot,
  createExchangeSnapshot,
  recalculateSnapshot,
} from "@/lib/exchangeRates";

describe("exchange rate snapshots", () => {
  it("uses rate one for identical currencies without an API request", async () => {
    const snapshot = await createExchangeSnapshot({
      sourceCurrency: "EUR",
      targetCurrency: "EUR",
      buyIn: 100,
      cashOut: 125,
      completedAt: new Date("2026-09-16T12:00:00Z"),
    });

    expect(snapshot.rate).toBe(1);
    expect(snapshot.convertedProfit).toBe(25);
  });

  it("reuses a frozen rate when amounts are edited", async () => {
    const snapshot = await buildSessionSnapshot({
      enabled: true,
      sourceCurrency: "USD",
      targetCurrency: "EUR",
      buyIn: 200,
      cashOut: 250,
      completedAt: new Date("2026-09-16T12:00:00Z"),
      existing: {
        currency: "USD",
        exchangeRate: 0.85,
        exchangeRateDate: new Date("2026-09-15T00:00:00Z"),
        convertedCurrency: "EUR",
      },
    });

    expect(snapshot.exchangeRate).toBe(0.85);
    expect(snapshot.convertedProfit).toBe(42.5);
    expect(snapshot.exchangeRateDate).toEqual(
      new Date("2026-09-15T00:00:00Z"),
    );
  });

  it("rounds converted monetary values", () => {
    expect(recalculateSnapshot(0.87345, 100, 125)).toEqual({
      convertedBuyIn: 87.35,
      convertedCashOut: 109.18,
      convertedProfit: 21.83,
    });
  });
});
