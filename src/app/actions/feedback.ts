"use server";

import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { sendFeedbackEmail } from "@/lib/email";
import { enforceRateLimit } from "@/lib/rateLimit";

export type FeedbackState = { ok: boolean; error?: string };

const feedbackSchema = z.object({
  message: z
    .string()
    .min(3, "Please write at least a few words.")
    .max(5000, "Maximum 5,000 characters allowed."),
});

export async function submitFeedbackAction(
  _previous: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  const user = await requireUser();

  try {
    await enforceRateLimit("feedback", [user.id]);
  } catch {
    return { ok: false, error: "Too many submissions. Please wait 15 minutes." };
  }

  const parsed = feedbackSchema.safeParse({ message: formData.get("message") });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check your input." };
  }

  try {
    await sendFeedbackEmail({
      email: user.email ?? "no email",
      message: parsed.data.message,
    });
  } catch (err) {
    console.error("[feedback] Mail error:", err);
    return { ok: false, error: "Feedback could not be sent. Please try again later." };
  }

  return { ok: true };
}
