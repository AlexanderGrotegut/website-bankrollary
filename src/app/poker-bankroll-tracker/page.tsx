import type { Metadata } from "next";
import { SeoPage } from "@/components/marketing/SeoPage";

export const metadata: Metadata = {
  title: "Free Poker Bankroll Tracker",
  description:
    "Track poker sessions, buy-ins, cash-outs, profit, ROI and hourly rate with Bankrollary's free poker bankroll tracker.",
  alternates: { canonical: "/poker-bankroll-tracker" },
};

const sections = [
  {
    title: "Why track your poker bankroll?",
    paragraphs: [
      "A poker bankroll tracker separates facts from short-term emotions. Recording every cash game and tournament gives you a reliable view of profit, volume and variance.",
      "Bankrollary keeps each session connected to its game type, poker room, currency and playing time. Your results remain searchable instead of disappearing into a spreadsheet.",
    ],
    bullets: [
      "Record buy-in, cash-out and session notes",
      "Calculate poker profit and ROI automatically",
      "Compare online poker rooms and live venues",
      "Review weekly, monthly, yearly and all-time results",
    ],
  },
  {
    title: "Measure more than wins and losses",
    paragraphs: [
      "Profit alone does not explain performance. Session duration, hourly rate and return on investment add context to every result. A small win over one hour is different from the same win after an entire day.",
      "Filtering by platform and game type helps you recognize where your bankroll performs best. Multiple currencies stay separate unless you choose to convert a completed session using a frozen exchange rate.",
    ],
  },
  {
    title: "Poker bankroll management made simple",
    paragraphs: [
      "Consistent records support better bankroll decisions, but tracking cannot remove normal poker variance. Use a bankroll that fits your limits and never risk money needed for essential expenses.",
      "Bankrollary records deposits and withdrawals separately from poker profit, so moving money does not distort your performance statistics.",
    ],
  },
];

const faq = [
  {
    question: "Is the poker bankroll tracker free?",
    answer:
      "Yes. You can create an account and track poker sessions without hidden costs.",
  },
  {
    question: "Can I track cash games and tournaments?",
    answer:
      "Yes. Create game types for cash games, tournaments, formats or stakes and add notes to individual sessions.",
  },
  {
    question: "How is poker ROI calculated?",
    answer:
      "ROI is calculated as profit divided by buy-in, multiplied by 100. Bankrollary calculates it automatically for completed sessions.",
  },
  {
    question: "Can I use different currencies?",
    answer:
      "Yes. Bankrollary supports multiple currencies and optional conversion into your preferred currency when a session is completed.",
  },
];

export default function PokerBankrollTrackerPage() {
  return (
    <SeoPage
      eyebrow="Free poker tracking"
      title="Poker Bankroll Tracker"
      description="Track every poker session, understand your real results and manage your bankroll with clear profit, ROI and hourly-rate statistics."
      sections={sections}
      faq={faq}
    />
  );
}
