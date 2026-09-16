import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.bankrollary.com",
  ),
  title: {
    default: "Bankrollary – Your Bankroll Diary",
    template: "%s | Bankrollary",
  },
  description:
    "Track your sessions, bankroll, ROI and hourly rate with Bankrollary.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Bankrollary",
    title: "Bankrollary – Your Bankroll Diary",
    description: "Track every session. Understand every result.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Bankrollary – Your Bankroll Diary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bankrollary – Your Bankroll Diary",
    description: "Track every session. Understand every result.",
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
