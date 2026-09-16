"use client";

import { useActionState } from "react";
import {
  saveSettingsAction,
  saveTransactionAction,
} from "@/app/actions/bankroll";
import { CURRENCIES } from "@/lib/domain";

function localDateTime() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

export function CurrencySettingsForm({
  defaultCurrency,
}: {
  defaultCurrency: string;
}) {
  const [state, action, pending] = useActionState(saveSettingsAction, {});
  return (
    <form action={action} className="inline-form">
      <label className="field flex-1"><span>Standardwährung</span><select name="defaultCurrency" defaultValue={defaultCurrency}>{CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}</select></label>
      <button className="button-secondary" disabled={pending}>Speichern</button>
      {state.error && <p className="form-error basis-full">{state.error}</p>}
      {state.success && <p className="form-success basis-full">{state.success}</p>}
    </form>
  );
}

export function TransactionForm({ defaultCurrency }: { defaultCurrency: string }) {
  const [state, action, pending] = useActionState(saveTransactionAction, {});
  return (
    <form action={action} className="form-grid">
      <label className="field"><span>Art</span><select name="type"><option value="STARTING_BALANCE">Startguthaben</option><option value="DEPOSIT">Einzahlung</option><option value="WITHDRAWAL">Auszahlung</option></select></label>
      <label className="field"><span>Betrag</span><input name="amount" type="number" min="0.01" step="0.01" required /></label>
      <label className="field"><span>Währung</span><select name="currency" defaultValue={defaultCurrency}>{CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}</select></label>
      <label className="field"><span>Zeitpunkt</span><input name="occurredAt" type="datetime-local" defaultValue={localDateTime()} required /></label>
      <label className="field sm:col-span-2"><span>Notiz (optional)</span><input name="note" maxLength={200} placeholder="z. B. monatliche Einzahlung" /></label>
      <div className="flex items-end"><button className="button-primary" disabled={pending}>{pending ? "Speichert …" : "Buchung hinzufügen"}</button></div>
      {state.error && <p className="form-error sm:col-span-2">{state.error}</p>}
      {state.success && <p className="form-success sm:col-span-2">{state.success}</p>}
    </form>
  );
}
