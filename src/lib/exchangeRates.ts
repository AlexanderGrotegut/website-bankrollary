import { z } from "zod";
import { CURRENCIES } from "@/lib/domain";

const responseSchema = z.object({
  date: z.iso.date(),
  rates: z.record(z.string(), z.number().positive()),
});

export type ExchangeSnapshot = {
  rate: number;
  rateDate: Date;
  targetCurrency: string;
  convertedBuyIn: number;
  convertedCashOut: number;
  convertedProfit: number;
};

export async function createExchangeSnapshot({
  sourceCurrency,
  targetCurrency,
  buyIn,
  cashOut,
  completedAt,
}: {
  sourceCurrency: string;
  targetCurrency: string;
  buyIn: number;
  cashOut: number;
  completedAt: Date;
}): Promise<ExchangeSnapshot> {
  const source = z.enum(CURRENCIES).parse(sourceCurrency);
  const target = z.enum(CURRENCIES).parse(targetCurrency);
  const fetched =
    source === target
      ? { rate: 1, rateDate: completedAt }
      : await fetchRate(source, target, completedAt);
  const { rate, rateDate } = fetched;
  const convertedBuyIn = roundMoney(buyIn * rate);
  const convertedCashOut = roundMoney(cashOut * rate);

  return {
    rate,
    rateDate,
    targetCurrency: target,
    convertedBuyIn,
    convertedCashOut,
    convertedProfit: roundMoney(convertedCashOut - convertedBuyIn),
  };
}

async function fetchRate(
  sourceCurrency: string,
  targetCurrency: string,
  completedAt: Date,
) {
  const date = completedAt.toISOString().slice(0, 10);
  const url = new URL(`https://api.frankfurter.app/${date}`);
  url.searchParams.set("from", sourceCurrency);
  url.searchParams.set("to", targetCurrency);

  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) throw new Error("Exchange rate service unavailable.");

  const parsed = responseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error("Exchange rate service returned invalid data.");
  }
  const rate = parsed.data.rates[targetCurrency];
  if (!rate) throw new Error("Exchange rate service returned invalid data.");
  return {
    rate,
    rateDate: new Date(`${parsed.data.date}T00:00:00.000Z`),
  };
}

export function recalculateSnapshot(
  rate: number,
  buyIn: number,
  cashOut: number,
) {
  const convertedBuyIn = roundMoney(buyIn * rate);
  const convertedCashOut = roundMoney(cashOut * rate);
  return {
    convertedBuyIn,
    convertedCashOut,
    convertedProfit: roundMoney(convertedCashOut - convertedBuyIn),
  };
}

type ExistingSnapshot = {
  currency: string;
  exchangeRate: number | null;
  exchangeRateDate: Date | null;
  convertedCurrency: string | null;
};

export async function buildSessionSnapshot({
  enabled,
  sourceCurrency,
  targetCurrency,
  buyIn,
  cashOut,
  completedAt,
  existing,
}: {
  enabled: boolean;
  sourceCurrency: string;
  targetCurrency: string;
  buyIn: number;
  cashOut: number | null;
  completedAt: Date | null;
  existing?: ExistingSnapshot;
}) {
  if (!enabled || cashOut === null || completedAt === null) {
    return {
      convertToDefaultCurrency: enabled,
      exchangeRate: null,
      exchangeRateDate: null,
      convertedCurrency: null,
      convertedBuyIn: null,
      convertedCashOut: null,
      convertedProfit: null,
    };
  }

  const reusableRate =
    existing?.currency === sourceCurrency &&
    existing.convertedCurrency === targetCurrency
      ? existing.exchangeRate
      : null;
  const snapshot = reusableRate !== null && reusableRate !== undefined
    ? {
        rate: reusableRate,
        rateDate: existing?.exchangeRateDate ?? completedAt,
        targetCurrency,
        ...recalculateSnapshot(reusableRate, buyIn, cashOut),
      }
    : await createExchangeSnapshot({
        sourceCurrency,
        targetCurrency,
        buyIn,
        cashOut,
        completedAt,
      });

  return {
    convertToDefaultCurrency: true,
    exchangeRate: snapshot.rate,
    exchangeRateDate: snapshot.rateDate,
    convertedCurrency: snapshot.targetCurrency,
    convertedBuyIn: snapshot.convertedBuyIn,
    convertedCashOut: snapshot.convertedCashOut,
    convertedProfit: snapshot.convertedProfit,
  };
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
