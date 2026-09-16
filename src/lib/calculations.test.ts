import { describe, expect, it } from "vitest";
import {
  calculateSessionMetrics,
  calculateWeightedRoi,
  signedTransactionAmount,
} from "@/lib/calculations";

describe("calculateSessionMetrics", () => {
  it("calculates profit, duration, ROI and hourly rate", () => {
    const metrics = calculateSessionMetrics({
      buyIn: 100,
      cashOut: 150,
      startedAt: new Date("2026-09-16T10:00:00Z"),
      endedAt: new Date("2026-09-16T12:00:00Z"),
    });

    expect(metrics).toEqual({
      profit: 50,
      durationMinutes: 120,
      roi: 50,
      hourlyRate: 25,
    });
  });

  it("returns unavailable metrics for a running session", () => {
    expect(
      calculateSessionMetrics({
        buyIn: 100,
        cashOut: null,
        startedAt: new Date(),
        endedAt: null,
      }),
    ).toEqual({
      profit: null,
      durationMinutes: null,
      roi: null,
      hourlyRate: null,
    });
  });

  it("does not divide by zero", () => {
    const metrics = calculateSessionMetrics({
      buyIn: 0,
      cashOut: 50,
      startedAt: new Date("2026-09-16T10:00:00Z"),
      endedAt: new Date("2026-09-16T10:00:00Z"),
    });
    expect(metrics.roi).toBeNull();
    expect(metrics.hourlyRate).toBeNull();
  });
});

describe("bankroll helpers", () => {
  it("signs withdrawals negatively", () => {
    expect(signedTransactionAmount("DEPOSIT", 100)).toBe(100);
    expect(signedTransactionAmount("WITHDRAWAL", 100)).toBe(-100);
  });

  it("calculates weighted ROI", () => {
    expect(calculateWeightedRoi(30, 200)).toBe(15);
    expect(calculateWeightedRoi(30, 0)).toBeNull();
  });
});
