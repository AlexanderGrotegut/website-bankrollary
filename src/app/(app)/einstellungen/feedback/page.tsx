import { MessageSquarePlus } from "lucide-react";
import { FeedbackForm } from "@/components/settings/FeedbackForm";
import { requireUser } from "@/lib/auth";

export default async function FeedbackPage() {
  await requireUser();

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Help us improve</p>
          <h1>Feedback &amp; Ideas</h1>
          <p>Tell us what you think — bug reports, feature requests, or anything else. Your message goes directly to the team.</p>
        </div>
      </header>
      <section className="panel mt-8" style={{ maxWidth: 640 }}>
        <div className="panel-heading">
          <div>
            <h2><MessageSquarePlus size={18} className="mr-2 inline-block align-text-bottom" />Send feedback</h2>
            <p>Your email is attached automatically so we can follow up</p>
          </div>
        </div>
        <FeedbackForm />
      </section>
    </>
  );
}
