"use client";

import { useActionState } from "react";
import { finishSessionAction } from "@/app/actions/sessions";

export function FinishSessionForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(finishSessionAction, {});

  return (
    <form action={action} className="flex flex-wrap items-center justify-end gap-2">
      <input type="hidden" name="id" value={id} />
      <input className="small-input" name="cashOut" type="number" min="0" step="0.01" placeholder="Cash-out" required />
      <button className="button-small" disabled={pending}>{pending ? "…" : "Beenden"}</button>
      {state.error && <small className="w-full text-right negative">{state.error}</small>}
    </form>
  );
}
