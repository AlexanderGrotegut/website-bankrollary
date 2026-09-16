export const GAME_TYPES = [
  ["POKER", "Poker"],
  ["SPORTS_BETTING", "Sports Betting"],
  ["CASINO", "Casino"],
  ["BLACKJACK", "Blackjack"],
  ["ROULETTE", "Roulette"],
  ["SLOTS", "Slots"],
] as const;

export const GAME_TYPE_VALUES = [
  "POKER",
  "SPORTS_BETTING",
  "CASINO",
  "BLACKJACK",
  "ROULETTE",
  "SLOTS",
] as const;

export const GAME_TYPE_LABELS = Object.fromEntries(GAME_TYPES);

export const CURRENCIES = ["EUR", "USD", "GBP", "CHF", "CAD", "AUD"] as const;

export type SupportedCurrency = (typeof CURRENCIES)[number];

export function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    signDisplay: "auto",
  }).format(value);
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${Math.round(minutes)} Min.`;
  const hours = Math.floor(minutes / 60);
  const remaining = Math.round(minutes % 60);
  return remaining ? `${hours} Std. ${remaining} Min.` : `${hours} Std.`;
}
