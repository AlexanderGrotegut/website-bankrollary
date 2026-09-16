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
      <label className="field flex-1"><span>Default currency</span><select name="defaultCurrency" defaultValue={defaultCurrency}>{CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}</select></label>
      <button className="button-secondary" disabled={pending}>Save</button>
      {state.error && <p className="form-error basis-full">{state.error}</p>}
      {state.success && <p className="form-success basis-full">{state.success}</p>}
    </form>
  );
}

export function TransactionForm({ defaultCurrency }: { defaultCurrency: string }) {
  const [state, action, pending] = useActionState(saveTransactionAction, {});
  return (
    <form action={action} className="form-grid">
      <label className="field"><span>Type</span><select name="type"><option value="STARTING_BALANCE">Starting balance</option><option value="DEPOSIT">Deposit</option><option value="WITHDRAWAL">Withdrawal</option></select></label>
      <label className="field"><span>Amount</span><input name="amount" type="number" min="0.01" step="0.01" required /></label>
      <label className="field"><span>Currency</span><select name="currency" defaultValue={defaultCurrency}>{CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}</select></label>
      <label className="field"><span>Date and time</span><input name="occurredAt" type="datetime-local" defaultValue={localDateTime()} required /></label>
      <label className="field sm:col-span-2"><span>Notes (optional)</span><input name="note" maxLength={200} placeholder="e.g. monthly deposit" /></label>
      <div className="flex items-end"><button className="button-primary" disabled={pending}>{pending ? "Saving …" : "Add transaction"}</button></div>
      {state.error && <p className="form-error sm:col-span-2">{state.error}</p>}
      {state.success && <p className="form-success sm:col-span-2">{state.success}</p>}
    </form>
  );
}
