"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/rateLimit";
import { createServerClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string };

const emailSchema = z.email("Bitte gib eine gültige E-Mail-Adresse ein.");
const passwordSchema = z
  .string()
  .min(8, "Das Passwort muss mindestens 8 Zeichen haben.")
  .max(72, "Das Passwort ist zu lang.");

async function clientIp() {
  const requestHeaders = await headers();
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    requestHeaders.get("x-real-ip") ??
    "unknown"
  );
}

async function limit(scope: string, email: string) {
  try {
    await enforceRateLimit(scope, [await clientIp(), email]);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Zu viele Versuche.";
  }
}

export async function registerAction(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = emailSchema.safeParse(formData.get("email"));
  const password = passwordSchema.safeParse(formData.get("password"));
  if (!email.success) return { error: email.error.issues[0]?.message };
  if (!password.success) return { error: password.error.issues[0]?.message };

  const rateLimitError = await limit("register", email.data);
  if (rateLimitError) return { error: rateLimitError };

  const supabase = await createServerClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email: email.data,
    password: password.data,
    options: { emailRedirectTo: `${appUrl}/auth/callback` },
  });

  if (error) return { error: "Registrierung fehlgeschlagen. Prüfe deine Angaben." };
  if (data.session) redirect("/dashboard");
  return { message: "Bitte bestätige deine E-Mail-Adresse." };
}

export async function loginAction(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = emailSchema.safeParse(formData.get("email"));
  const password = z.string().min(1).safeParse(formData.get("password"));
  if (!email.success || !password.success) return { error: "Ungültige Eingaben." };

  const rateLimitError = await limit("login", email.data);
  if (rateLimitError) return { error: rateLimitError };

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.data,
    password: password.data,
  });
  if (error) return { error: "E-Mail-Adresse oder Passwort ist falsch." };
  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function forgotPasswordAction(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = emailSchema.safeParse(formData.get("email"));
  const message =
    "Falls ein Konto existiert, erhältst du eine E-Mail zum Zurücksetzen.";
  if (!email.success) return { message };
  if (await limit("forgot", email.data)) return { message };

  const supabase = await createServerClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: `${appUrl}/auth/callback?next=/passwort`,
  });
  return { message };
}

export async function resetPasswordAction(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const password = passwordSchema.safeParse(formData.get("password"));
  if (!password.success) return { error: password.error.issues[0]?.message };

  const supabase = await createServerClient();
  const { error } = await supabase.auth.updateUser({ password: password.data });
  if (error) return { error: "Das Passwort konnte nicht geändert werden." };
  redirect("/dashboard");
}
