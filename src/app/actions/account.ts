"use server";

import { z } from "zod";
import type { FormState } from "@/app/actions/sessions";
import { requireUser } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rateLimit";
import { createServerClient } from "@/lib/supabase/server";

const emailChangeSchema = z.object({
  email: z.email("Enter a valid email address."),
  currentPassword: z.string().min(1, "Enter your current password."),
});

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z.string().min(8, "Use at least 8 characters.").max(72),
    confirmPassword: z.string(),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "The new passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((value) => value.newPassword !== value.currentPassword, {
    message: "Choose a password different from your current one.",
    path: ["newPassword"],
  });

async function verifyPassword(email: string, password: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? null : supabase;
}

async function allowChange(userId: string) {
  try {
    await enforceRateLimit("account-change", [userId]);
    return true;
  } catch {
    return false;
  }
}

export async function changeEmailAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = emailChangeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  if (!user.email) return { error: "Your account has no email address." };
  if (parsed.data.email.toLowerCase() === user.email.toLowerCase()) {
    return { error: "This is already your email address." };
  }
  if (!(await allowChange(user.id))) {
    return { error: "Too many attempts. Please try again later." };
  }

  const supabase = await verifyPassword(user.email, parsed.data.currentPassword);
  if (!supabase) return { error: "Your current password is incorrect." };
  const { error } = await supabase.auth.updateUser({ email: parsed.data.email });
  if (error) return { error: "The email address could not be updated." };

  return {
    success:
      "Email updated. Check your inbox if your project requires confirmation.",
  };
}

export async function changePasswordAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = passwordChangeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  if (!user.email) return { error: "Your account has no email address." };
  if (!(await allowChange(user.id))) {
    return { error: "Too many attempts. Please try again later." };
  }

  const supabase = await verifyPassword(user.email, parsed.data.currentPassword);
  if (!supabase) return { error: "Your current password is incorrect." };
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });
  if (error) return { error: "The password could not be updated." };

  return { success: "Password updated." };
}
