"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/rateLimit";
import { createServerClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string };

const emailSchema = z.email("Enter a valid email address.");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(72, "Password is too long.");

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
  } catch {
    return "Login is temporarily unavailable. Please try again shortly.";
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

  if (error) return { error: "Registration failed. Check your details." };
  if (data.session) redirect("/dashboard");
  return { message: "Please confirm your email address." };
}

export async function loginAction(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = emailSchema.safeParse(formData.get("email"));
  const password = z.string().min(1).safeParse(formData.get("password"));
  if (!email.success || !password.success) return { error: "Invalid credentials." };

  const rateLimitError = await limit("login", email.data);
  if (rateLimitError) return { error: rateLimitError };

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.data,
    password: password.data,
  });
  if (error) return { error: "Email address or password is incorrect." };
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
    "If an account exists, you will receive a password reset email.";
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
  if (error) return { error: "The password could not be updated." };
  redirect("/dashboard");
}
