"use client";

import { useActionState } from "react";
import { createPlatformAction } from "@/app/actions/platforms";

export function PlatformForm({ compact = false }: { compact?: boolean }) {
  const [state, action, pending] = useActionState(createPlatformAction, {});

  return (
    <form action={action} className={compact ? "inline-form" : "space-y-4"}>
      <label className="field flex-1">
        <span>New platform</span>
        <input name="name" minLength={2} maxLength={50} placeholder="e.g. PokerStars or a local venue" required />
      </label>
      <button className="button-secondary" disabled={pending}>{pending ? "Saving …" : "Add platform"}</button>
      {state.error && <p className="form-error basis-full">{state.error}</p>}
      {state.success && <p className="form-success basis-full">{state.success}</p>}
    </form>
  );
}
