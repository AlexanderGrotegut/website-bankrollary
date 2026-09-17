import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bankrollary - Your Bankroll Diary",
    short_name: "Bankrollary",
    description:
      "Track gaming sessions, bankroll, profit, ROI and hourly rate.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfcfc",
    theme_color: "#0b8064",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
