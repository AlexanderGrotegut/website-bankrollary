"use client";

import { useActionState } from "react";
import { createPlatformAction } from "@/app/actions/platforms";

export function PlatformForm({ compact = false }: { compact?: boolean }) {
  const [state, action, pending] = useActionState(createPlatformAction, {});

  return (
    <form action={action} className={compact ? "inline-form" : "space-y-4"}>
      <label className="field flex-1">
        <span>Neue Plattform</span>
        <input name="name" minLength={2} maxLength={50} placeholder="z. B. PokerStars oder Casino Kiel" required />
      </label>
      <button className="button-secondary" disabled={pending}>{pending ? "Speichert …" : "Plattform hinzufügen"}</button>
      {state.error && <p className="form-error basis-full">{state.error}</p>}
      {state.success && <p className="form-success basis-full">{state.success}</p>}
    </form>
  );
}
