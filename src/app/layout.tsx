import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "Bankrollary",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.bankrollary.com",
  ),
  title: {
    default: "Bankrollary - Your Bankroll Diary",
    template: "%s | Bankrollary",
  },
  description:
    "Free bankroll tracker and poker bankroll tracker for sessions, profit, ROI, hourly rate and bankroll management.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "bankroll tracker",
    "poker bankroll tracker",
    "bankroll diary",
    "bankroll management app",
    "session tracker",
    "poker session tracker",
    "poker profit tracker",
    "poker ROI calculator",
    "gambling tracker",
    "gambling session tracker",
    "betting tracker",
    "sports betting tracker",
    "betting bankroll management",
    "casino bankroll tracker",
    "blackjack tracker",
    "roulette tracker",
    "slots tracker",
    "bankroll calculator",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Bankrollary",
    title: "Bankrollary - Your Bankroll Diary",
    description:
      "Free bankroll tracker for poker, betting and casino sessions, profit, ROI and hourly rate.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Bankrollary - Your Bankroll Diary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bankrollary - Your Bankroll Diary",
    description:
      "Free bankroll tracker for poker, betting and casino sessions, profit, ROI and hourly rate.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
