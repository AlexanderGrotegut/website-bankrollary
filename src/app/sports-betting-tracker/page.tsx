import type { Metadata } from "next";
import { SeoPage } from "@/components/marketing/SeoPage";

export const metadata: Metadata = {
  title: "Free Sports Betting Tracker",
  description:
    "Track sports betting sessions, bankroll, profit, ROI and betting platforms with Bankrollary's free betting tracker.",
  alternates: { canonical: "/sports-betting-tracker" },
};

const sections = [
  {
    title: "Keep a clear sports betting record",
    paragraphs: [
      "A sports betting tracker creates a consistent history of the money committed and returned during each betting session. This makes overall profit and bankroll development easier to understand.",
      "Bankrollary lets you organize sessions by sportsbook, currency and your own game types. Notes can capture leagues, markets or strategies without exposing your records publicly.",
    ],
    bullets: [
      "Compare results across sportsbooks",
      "Calculate session profit and ROI",
      "Track deposits and withdrawals separately",
      "Filter history by platform, currency and date",
      "Export your session history as CSV",
    ],
  },
  {
    title: "Separate betting performance from cash movements",
    paragraphs: [
      "Depositing money does not create profit, and withdrawing money does not create a loss. A useful betting bankroll tracker records these as bankroll transactions while calculating performance from completed sessions.",
      "This separation prevents account funding from making results look better or worse than they actually are.",
    ],
  },
  {
    title: "Review ROI in context",
    paragraphs: [
      "Return on investment compares profit with the amount committed. It becomes more informative alongside session count, total volume and a sufficiently large history.",
      "Short winning or losing periods can be driven by variance. Avoid chasing losses and set limits that protect money required for everyday expenses.",
    ],
  },
];

const faq = [
  {
    question: "Is Bankrollary a bet-selection service?",
    answer:
      "No. Bankrollary records bankroll activity and results. It does not provide picks, odds or promises of profit.",
  },
  {
    question: "Can I track multiple sportsbooks?",
    answer:
      "Yes. Create each sportsbook as a platform and filter your session history to compare results.",
  },
  {
    question: "Are deposits included in betting profit?",
    answer:
      "No. Deposits and withdrawals affect the bankroll balance but remain separate from session profit and loss.",
  },
  {
    question: "Can I export my betting history?",
    answer:
      "Yes. Session records can be filtered and exported as a CSV file.",
  },
];

export default function SportsBettingTrackerPage() {
  return (
    <SeoPage
      eyebrow="Free betting records"
      title="Sports Betting Tracker"
      description="Track betting sessions, compare sportsbooks and keep deposits separate from your real profit and ROI."
      sections={sections}
      faq={faq}
    />
  );
}
