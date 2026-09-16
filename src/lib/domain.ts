export const CURRENCIES = ["EUR", "USD", "GBP", "CHF", "CAD", "AUD"] as const;

export type SupportedCurrency = (typeof CURRENCIES)[number];

export function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    signDisplay: "auto",
  }).format(value);
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = Math.round(minutes % 60);
  return remaining ? `${hours} hr ${remaining} min` : `${hours} hr`;
}
