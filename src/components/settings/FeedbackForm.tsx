"use client";

import { useActionState } from "react";
import { submitFeedbackAction } from "@/app/actions/feedback";

export function FeedbackForm() {
  const [state, action, pending] = useActionState(submitFeedbackAction, { ok: false });

  if (state.ok) {
    return (
      <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-5 text-sm space-y-3">
        <p className="font-medium text-[var(--accent)]">Thank you for your feedback!</p>
        <p className="text-[var(--muted)]">We appreciate you taking the time to help us improve Bankrollary.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-link"
        >
          Submit more feedback
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="feedback-message" className="mb-2 block text-sm font-medium">
          Your feedback
        </label>
        <textarea
          id="feedback-message"
          name="message"
          rows={6}
          required
          minLength={3}
          maxLength={5000}
          placeholder="Tell us what you like, what bothers you, or what features you'd love to see …"
          className="w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
      </div>
      {state.error && <p className="form-error">{state.error}</p>}
      <button className="button-primary" disabled={pending}>
        {pending ? "Sending …" : "Send feedback"}
      </button>
    </form>
  );
}
