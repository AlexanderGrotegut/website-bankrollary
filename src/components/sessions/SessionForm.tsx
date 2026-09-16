"use client";

import { useActionState, useMemo, useState } from "react";
import { saveSessionAction } from "@/app/actions/sessions";
import { calculateSessionMetrics } from "@/lib/calculations";
import { CURRENCIES, formatDuration, formatMoney, GAME_TYPES } from "@/lib/domain";

export type EditableSession = {
  id: string;
  type: string;
  platformId: string;
  currency: string;
  startedAt: string;
  endedAt: string;
  buyIn: number;
  cashOut: number | null;
  notes: string;
};

type Props = {
  platforms: { id: string; name: string }[];
  defaultCurrency: string;
  session?: EditableSession;
};

function localDateTime(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function SessionForm({ platforms, defaultCurrency, session }: Props) {
  const [state, action, pending] = useActionState(saveSessionAction, {});
  const [running, setRunning] = useState(session ? !session.endedAt : false);
  const [buyIn, setBuyIn] = useState(session?.buyIn ?? 0);
  const [cashOut, setCashOut] = useState(session?.cashOut ?? 0);
  const [currency, setCurrency] = useState(session?.currency ?? defaultCurrency);
  const [startedAt, setStartedAt] = useState(session?.startedAt ?? localDateTime());
  const [endedAt, setEndedAt] = useState(session?.endedAt || localDateTime());

  const preview = useMemo(
    () =>
      calculateSessionMetrics({
        buyIn,
        cashOut: running ? null : cashOut,
        startedAt: new Date(startedAt),
        endedAt: running ? null : new Date(endedAt),
      }),
    [buyIn, cashOut, endedAt, running, startedAt],
  );

  return (
    <form action={action} className="space-y-7">
      {session && <input type="hidden" name="id" value={session.id} />}
      <input type="hidden" name="isRunning" value={String(running)} />
      <div className="form-grid">
        <label className="field"><span>Typ</span><select name="type" defaultValue={session?.type ?? "POKER"}>{GAME_TYPES.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
        <label className="field"><span>Plattform</span><select name="platformId" defaultValue={session?.platformId} required><option value="">Plattform auswählen</option>{platforms.map((platform) => <option key={platform.id} value={platform.id}>{platform.name}</option>)}</select></label>
        <label className="field"><span>Währung</span><select name="currency" value={currency} onChange={(event) => setCurrency(event.target.value)}>{CURRENCIES.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="field"><span>Start</span><input name="startedAt" type="datetime-local" value={startedAt} onChange={(event) => setStartedAt(event.target.value)} required /></label>
        <label className="field"><span>Buy-in</span><div className="input-affix"><input name="buyIn" type="number" min="0" step="0.01" value={buyIn} onChange={(event) => setBuyIn(event.target.valueAsNumber || 0)} required /><b>{currency}</b></div></label>
        {!running && <label className="field"><span>Cash-out</span><div className="input-affix"><input name="cashOut" type="number" min="0" step="0.01" value={cashOut} onChange={(event) => setCashOut(event.target.valueAsNumber || 0)} required /><b>{currency}</b></div></label>}
        {!running && <label className="field"><span>Ende</span><input name="endedAt" type="datetime-local" value={endedAt} onChange={(event) => setEndedAt(event.target.value)} required /></label>}
        <label className="toggle-field"><input type="checkbox" checked={running} onChange={(event) => setRunning(event.target.checked)} /><span><b>Laufende Session</b><small>Cash-out und Ende später ergänzen</small></span></label>
      </div>
      <label className="field"><span>Notiz (optional)</span><textarea name="notes" maxLength={500} rows={3} defaultValue={session?.notes} placeholder="Turnier, Spielvariante oder kurze Gedanken …" /></label>

      {!running && (
        <div className="preview-grid">
          <Preview label="P/L" value={preview.profit === null ? "—" : formatMoney(preview.profit, currency)} tone={preview.profit} />
          <Preview label="Dauer" value={preview.durationMinutes && preview.durationMinutes > 0 ? formatDuration(preview.durationMinutes) : "—"} />
          <Preview label="ROI" value={preview.roi === null ? "—" : `${preview.roi.toFixed(1)} %`} tone={preview.roi} />
          <Preview label="Stundenlohn" value={preview.hourlyRate === null ? "—" : formatMoney(preview.hourlyRate, currency)} tone={preview.hourlyRate} />
        </div>
      )}
      {state.error && <p className="form-error">{state.error}</p>}
      {state.success && <p className="form-success">{state.success}</p>}
      <button className="button-primary" disabled={pending || !platforms.length}>{pending ? "Wird gespeichert …" : session ? "Änderungen speichern" : running ? "Session starten" : "Session speichern"}</button>
      {!platforms.length && <p className="form-error">Erstelle zuerst eine Plattform.</p>}
    </form>
  );
}

function Preview({ label, value, tone }: { label: string; value: string; tone?: number | null }) {
  const className = tone === undefined || tone === null || tone === 0 ? "" : tone > 0 ? "positive" : "negative";
  return <div><span>{label}</span><strong className={className}>{value}</strong></div>;
}
