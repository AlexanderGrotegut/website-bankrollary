"use client";

import { useActionState, useMemo, useState } from "react";
import { saveSessionAction } from "@/app/actions/sessions";
import { calculateSessionMetrics } from "@/lib/calculations";
import { CURRENCIES, formatDuration, formatMoney } from "@/lib/domain";

export type EditableSession = {
  id: string;
  gameCategoryId: string;
  platformId: string;
  currency: string;
  startedAt: string;
  endedAt: string;
  buyIn: number;
  cashOut: number | null;
  notes: string;
  convertToDefaultCurrency: boolean;
  exchangeRate: number | null;
  convertedCurrency: string | null;
};

type Props = {
  platforms: { id: string; name: string }[];
  gameCategories: { id: string; name: string }[];
  defaultCurrency: string;
  defaultGameCategoryId?: string;
  defaultPlatformId?: string;
  session?: EditableSession;
};

function localDateTime(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function SessionForm({
  platforms,
  gameCategories,
  defaultCurrency,
  defaultGameCategoryId,
  defaultPlatformId,
  session,
}: Props) {
  const [state, action, pending] = useActionState(saveSessionAction, {});
  const [gameCategoryId, setGameCategoryId] = useState(
    session?.gameCategoryId ?? defaultGameCategoryId ?? "",
  );
  const [platformId, setPlatformId] = useState(
    session?.platformId ?? defaultPlatformId ?? "",
  );
  const [running, setRunning] = useState(session ? !session.endedAt : false);
  const [convert, setConvert] = useState(session?.convertToDefaultCurrency ?? false);
  const [buyIn, setBuyIn] = useState<number | "">(session?.buyIn ?? "");
  const [cashOut, setCashOut] = useState<number | "">(session?.cashOut ?? "");
  const [currency, setCurrency] = useState(session?.currency ?? defaultCurrency);
  const [startedAt, setStartedAt] = useState(session?.startedAt ?? localDateTime());
  const [endedAt, setEndedAt] = useState(() =>
    session?.endedAt ||
    localDateTime(new Date(new Date(startedAt).getTime() + 60 * 60_000)),
  );
  const preview = useMemo(
    () =>
      calculateSessionMetrics({
        buyIn: buyIn === "" ? 0 : buyIn,
        cashOut: running ? null : cashOut === "" ? 0 : cashOut,
        startedAt: new Date(startedAt),
        endedAt: running ? null : new Date(endedAt),
      }),
    [buyIn, cashOut, endedAt, running, startedAt],
  );

  return (
    <form action={action} className="space-y-7">
      {session && <input type="hidden" name="id" value={session.id} />}
      <input type="hidden" name="isRunning" value={String(running)} />
      <input type="hidden" name="convertToDefaultCurrency" value={String(convert)} />
      <div className="form-grid">
        <label className="field"><span>Game type</span><select name="gameCategoryId" value={gameCategoryId} onChange={(event) => setGameCategoryId(event.target.value)} required><option value="" disabled>Select a game type</option>{gameCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label className="field"><span>Platform</span><select name="platformId" value={platformId} onChange={(event) => setPlatformId(event.target.value)} required><option value="" disabled>Select a platform</option>{platforms.map((platform) => <option key={platform.id} value={platform.id}>{platform.name}</option>)}</select></label>
        <label className="field"><span>Currency <small className="field-note">Preferred currency: {defaultCurrency}</small></span><select name="currency" value={currency} onChange={(event) => setCurrency(event.target.value)}>{CURRENCIES.map((item) => <option key={item}>{item}</option>)}</select></label>
        <Toggle checked={convert} onChange={setConvert} title={`Convert to ${defaultCurrency}`} detail="Freeze the exchange rate when this session ends" />
        <label className="field"><span>Start</span><input name="startedAt" type="datetime-local" value={startedAt} onChange={(event) => setStartedAt(event.target.value)} required /></label>
        {!running && <label className="field"><span>End</span><input name="endedAt" type="datetime-local" value={endedAt} onChange={(event) => setEndedAt(event.target.value)} required /></label>}
        <label className="field"><span>Buy-in</span><div className="input-affix"><input name="buyIn" type="number" min="0" step="0.01" placeholder="0" value={buyIn} onChange={(event) => setBuyIn(event.target.value === "" ? "" : event.target.valueAsNumber)} required /><b>{currency}</b></div></label>
        {!running && <label className="field"><span>Cash-out</span><div className="input-affix"><input name="cashOut" type="number" min="0" step="0.01" placeholder="0" value={cashOut} onChange={(event) => setCashOut(event.target.value === "" ? "" : event.target.valueAsNumber)} required /><b>{currency}</b></div></label>}
        <Toggle checked={running} onChange={setRunning} title="Running session" detail="Add cash-out and end time later" />
      </div>
      {session?.exchangeRate && session.convertedCurrency && (
        <p className="form-success">
          Saved rate: 1 {session.currency} = {session.exchangeRate.toFixed(6)} {session.convertedCurrency}. This rate will not update automatically.
        </p>
      )}
      <label className="field"><span>Notes (optional)</span><textarea name="notes" maxLength={500} rows={3} defaultValue={session?.notes} placeholder="Tournament, game variant or a short note …" /></label>
      {!running && (
        <div className="preview-grid">
          <Preview label="P/L" value={preview.profit === null ? "—" : formatMoney(preview.profit, currency)} tone={preview.profit} />
          <Preview label="Duration" value={preview.durationMinutes && preview.durationMinutes > 0 ? formatDuration(preview.durationMinutes) : "—"} />
          <Preview label="ROI" value={preview.roi === null ? "—" : `${preview.roi.toFixed(1)}%`} tone={preview.roi} />
          <Preview label="Hourly rate" value={preview.hourlyRate === null ? "—" : formatMoney(preview.hourlyRate, currency)} tone={preview.hourlyRate} />
        </div>
      )}
      {state.error && <p className="form-error">{state.error}</p>}
      {state.success && <p className="form-success">{state.success}</p>}
      <button className="button-primary" disabled={pending || !platforms.length || !gameCategories.length}>{pending ? "Saving …" : session ? "Save changes" : running ? "Start session" : "Save session"}</button>
      {!platforms.length && <p className="form-error">Create a platform first.</p>}
    </form>
  );
}

function Toggle({ checked, onChange, title, detail }: { checked: boolean; onChange: (value: boolean) => void; title: string; detail: string }) {
  return <label className="toggle-field"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span><b>{title}</b><small>{detail}</small></span></label>;
}

function Preview({ label, value, tone }: { label: string; value: string; tone?: number | null }) {
  const className = tone === undefined || tone === null || tone === 0 ? "" : tone > 0 ? "positive" : "negative";
  return <div><span>{label}</span><strong className={className}>{value}</strong></div>;
}
