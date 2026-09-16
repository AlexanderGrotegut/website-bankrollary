"use client";

import { useActionState } from "react";
import {
  changeEmailAction,
  changePasswordAction,
} from "@/app/actions/account";

export function EmailForm({ currentEmail }: { currentEmail: string }) {
  const [state, action, pending] = useActionState(changeEmailAction, {});

  return (
    <form action={action} className="space-y-4">
      <label className="field">
        <span>New email address</span>
        <input
          name="email"
          type="email"
          defaultValue={currentEmail}
          autoComplete="email"
          required
        />
      </label>
      <label className="field">
        <span>Current password</span>
        <input
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      {state.error && <p className="form-error">{state.error}</p>}
      {state.success && <p className="form-success">{state.success}</p>}
      <button className="button-secondary" disabled={pending}>
        {pending ? "Updating …" : "Update email"}
      </button>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, {});

  return (
    <form action={action} className="space-y-4">
      <label className="field">
        <span>Current password</span>
        <input
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      <label className="field">
        <span>New password</span>
        <input
          name="newPassword"
          type="password"
          minLength={8}
          autoComplete="new-password"
          required
        />
      </label>
      <label className="field">
        <span>Confirm new password</span>
        <input
          name="confirmPassword"
          type="password"
          minLength={8}
          autoComplete="new-password"
          required
        />
      </label>
      {state.error && <p className="form-error">{state.error}</p>}
      {state.success && <p className="form-success">{state.success}</p>}
      <button className="button-secondary" disabled={pending}>
        {pending ? "Updating …" : "Update password"}
      </button>
    </form>
  );
}
