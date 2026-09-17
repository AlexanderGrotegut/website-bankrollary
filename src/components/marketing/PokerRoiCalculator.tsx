"use client";

import { useState } from "react";

export function PokerRoiCalculator() {
  const [buyIn, setBuyIn] = useState("");
  const [cashOut, setCashOut] = useState("");
  const buyInAmount = Number(buyIn);
  const cashOutAmount = Number(cashOut);
  const hasResult =
    buyIn !== "" &&
    cashOut !== "" &&
    Number.isFinite(buyInAmount) &&
    Number.isFinite(cashOutAmount) &&
    buyInAmount > 0;
  const profit = hasResult ? cashOutAmount - buyInAmount : 0;
  const roi = hasResult ? (profit / buyInAmount) * 100 : 0;

  return (
    <section className="roi-calculator">
      <h2>Calculate your poker ROI</h2>
      <p>Enter the total buy-in and cash-out for a session.</p>
      <div className="roi-calculator-grid mt-5">
        <label className="field">
          <span>Buy-in</span>
          <input
            className="session-amount-input"
            inputMode="decimal"
            min="0.01"
            placeholder="100"
            step="0.01"
            type="number"
            value={buyIn}
            onChange={(event) => setBuyIn(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Cash-out</span>
          <input
            className="session-amount-input"
            inputMode="decimal"
            min="0"
            placeholder="125"
            step="0.01"
            type="number"
            value={cashOut}
            onChange={(event) => setCashOut(event.target.value)}
          />
        </label>
      </div>
      <div className="roi-result" aria-live="polite">
        <span>Return on investment</span>
        <strong>{hasResult ? `${roi.toFixed(2)}%` : "—"}</strong>
        <p>
          {hasResult
            ? `Profit / loss: ${profit >= 0 ? "+" : ""}${profit.toFixed(2)}`
            : "ROI appears after both amounts are entered."}
        </p>
      </div>
    </section>
  );
}
