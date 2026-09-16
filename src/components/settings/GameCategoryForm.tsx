"use client";

import { useActionState } from "react";
import { createGameCategoryAction } from "@/app/actions/gameCategories";

export function GameCategoryForm() {
  const [state, action, pending] = useActionState(createGameCategoryAction, {});

  return (
    <form action={action} className="inline-form">
      <label className="field flex-1">
        <span>New game type</span>
        <input
          name="name"
          minLength={2}
          maxLength={40}
          placeholder="e.g. Crypto Trading"
          required
        />
      </label>
      <button className="button-secondary" disabled={pending}>
        {pending ? "Saving …" : "Add game type"}
      </button>
      {state.error && <p className="form-error basis-full">{state.error}</p>}
      {state.success && <p className="form-success basis-full">{state.success}</p>}
    </form>
  );
}
