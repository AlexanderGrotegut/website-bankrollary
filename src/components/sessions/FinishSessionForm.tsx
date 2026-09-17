"use client";

import { useActionState, useRef } from "react";
import { finishSessionAction } from "@/app/actions/sessions";

export function FinishSessionForm({ id }: { id: string }) {
  const timezoneOffsetRef = useRef<HTMLInputElement>(null);
  const [state, action, pending] = useActionState(finishSessionAction, {});

  return (
    <form
      action={action}
      className="flex flex-wrap items-center justify-end gap-2"
      onSubmit={() => {
        if (timezoneOffsetRef.current) {
          timezoneOffsetRef.current.value = String(new Date().getTimezoneOffset());
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input ref={timezoneOffsetRef} type="hidden" name="timezoneOffset" defaultValue="0" />
      <input className="small-input session-amount-input" name="cashOut" type="number" min="0" step="0.01" placeholder="Cash-out" required />
      <button className="button-small" disabled={pending}>{pending ? "…" : "Complete"}</button>
      {state.error && <small className="w-full text-right negative">{state.error}</small>}
    </form>
  );
}
