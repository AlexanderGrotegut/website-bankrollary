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
    title: "Willkommen zurück",
    subtitle: "Melde dich an und behalte deine Bankroll im Blick.",
    button: "Anmelden",
  },
  register: {
    title: "Account erstellen",
    subtitle: "Deine Sessions. Deine Zahlen. Deine Entscheidungen.",
    button: "Kostenlos registrieren",
  },
  forgot: {
    title: "Passwort vergessen",
    subtitle: "Wir senden dir einen sicheren Link zum Zurücksetzen.",
    button: "Link anfordern",
  },
  reset: {
    title: "Neues Passwort",
    subtitle: "Wähle ein neues Passwort mit mindestens 8 Zeichen.",
    button: "Passwort speichern",
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
            <span>E-Mail-Adresse</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
        )}
        {showPassword && (
          <label className="field">
            <span>Passwort</span>
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
          {pending ? "Bitte warten …" : copy.button}
        </button>
      </form>

      <div className="mt-6 flex justify-between text-sm text-[var(--muted)]">
        {mode === "login" && (
          <>
            <Link href="/registrieren">Account erstellen</Link>
            <Link href="/passwort-vergessen">Passwort vergessen?</Link>
          </>
        )}
        {mode === "register" && <Link href="/login">Schon registriert? Anmelden</Link>}
        {(mode === "forgot" || mode === "reset") && (
          <Link href="/login">Zurück zur Anmeldung</Link>
        )}
      </div>
    </div>
  );
}
