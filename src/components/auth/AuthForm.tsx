"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  forgotPasswordAction,
  loginAction,
  registerAction,
  resetPasswordAction,
  type AuthState,
} from "@/app/actions/auth";

type Mode = "login" | "register" | "forgot" | "reset";

const content = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in and keep your bankroll in view.",
    button: "Sign in",
  },
  register: {
    title: "Create your account",
    subtitle: "Your sessions. Your numbers. Your decisions.",
    button: "Create free account",
  },
  forgot: {
    title: "Forgot your password?",
    subtitle: "We will send you a secure reset link.",
    button: "Request reset link",
  },
  reset: {
    title: "New password",
    subtitle: "Choose a new password with at least 8 characters.",
    button: "Save password",
  },
} satisfies Record<Mode, { title: string; subtitle: string; button: string }>;

const actions = {
  login: loginAction,
  register: registerAction,
  forgot: forgotPasswordAction,
  reset: resetPasswordAction,
};

export function AuthForm({ mode }: { mode: Mode }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    actions[mode],
    {},
  );
  const copy = content[mode];
  const showEmail = mode !== "reset";
  const showPassword = mode === "login" || mode === "register" || mode === "reset";

  return (
    <div className="auth-card">
      <Link href="/" className="brand mb-10 inline-flex">
        <span className="brand-mark">B</span>
        Bankrollary
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">{copy.subtitle}</p>

      <form action={action} className="mt-8 space-y-5">
        {showEmail && (
          <label className="field">
            <span>Email address</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
        )}
        {showPassword && (
          <label className="field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={mode === "login" ? 1 : 8}
              required
            />
          </label>
        )}
        {state.error && <p className="form-error">{state.error}</p>}
        {state.message && <p className="form-success">{state.message}</p>}
        <button className="button-primary w-full" disabled={pending}>
          {pending ? "Please wait …" : copy.button}
        </button>
      </form>

      <div className="mt-6 flex justify-between text-sm text-[var(--muted)]">
        {mode === "login" && (
          <>
            <Link href="/registrieren">Create account</Link>
            <Link href="/passwort-vergessen">Forgot password?</Link>
          </>
        )}
        {mode === "register" && <Link href="/login">Already registered? Sign in</Link>}
        {(mode === "forgot" || mode === "reset") && (
          <Link href="/login">Back to sign in</Link>
        )}
      </div>
    </div>
  );
}
