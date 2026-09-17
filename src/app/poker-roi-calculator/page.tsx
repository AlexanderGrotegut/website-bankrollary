import type { Metadata } from "next";
import { PokerRoiCalculator } from "@/components/marketing/PokerRoiCalculator";
import { SeoPage } from "@/components/marketing/SeoPage";

export const metadata: Metadata = {
  title: "Free Poker ROI Calculator",
  description:
    "Calculate poker ROI and profit from your buy-in and cash-out, then learn how to interpret return on investment.",
  alternates: { canonical: "/poker-roi-calculator" },
};

const sections = [
  {
    title: "How to calculate poker ROI",
    paragraphs: [
      "Poker ROI measures profit relative to the amount invested. Subtract the buy-in from the cash-out to find profit, divide that profit by the buy-in and multiply the result by 100.",
      "For example, a total buy-in of 100 and cash-out of 125 creates 25 profit. Dividing 25 by 100 produces an ROI of 25%. A cash-out below the buy-in produces a negative ROI.",
    ],
    bullets: [
      "Profit = cash-out minus buy-in",
      "ROI = profit divided by buy-in × 100",
      "A positive ROI indicates profit",
      "A negative ROI indicates a loss",
    ],
  },
  {
    title: "Tournament ROI and session ROI",
    paragraphs: [
      "Tournament players commonly calculate ROI across many entries by comparing total profit with total buy-ins. The same formula can also describe one completed session.",
      "A single result is not enough to evaluate long-term performance. Sample size, stakes, fees, game format and variance all affect how useful the percentage is.",
    ],
  },
  {
    title: "Track ROI automatically",
    paragraphs: [
      "The calculator gives a quick standalone result. A bankroll tracker keeps every result together and calculates ROI across selected periods without manual spreadsheets.",
      "Bankrollary also records duration, hourly rate, platforms and currencies, helping you review ROI alongside the rest of your session data.",
    ],
  },
];

const faq = [
  {
    question: "What is a good poker ROI?",
    answer:
      "There is no universal target. Game format, stakes, fees, skill level and sample size all influence sustainable ROI.",
  },
  {
    question: "Can poker ROI be negative?",
    answer:
      "Yes. When cash-out is lower than buy-in, profit and ROI are negative.",
  },
  {
    question: "Why is ROI unavailable with a zero buy-in?",
    answer:
      "ROI requires division by the invested amount. Dividing by zero is undefined, so a positive buy-in is required.",
  },
  {
    question: "Does a high ROI guarantee future profit?",
    answer:
      "No. Historical ROI describes past results and does not guarantee future outcomes.",
  },
];

export default function PokerRoiCalculatorPage() {
  return (
    <SeoPage
      eyebrow="Free poker calculator"
      title="Poker ROI Calculator"
      description="Calculate poker return on investment instantly from your buy-in and cash-out. No registration is required to use the calculator."
      sections={sections}
      faq={faq}
    >
      <PokerRoiCalculator />
    </SeoPage>
  );
}
