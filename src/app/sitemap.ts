import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.bankrollary.com"
  ).replace(/\/$/, "");

  const pages = [
    { path: "", priority: 1 },
    { path: "/poker-bankroll-tracker", priority: 0.9 },
    { path: "/bankroll-management-guide", priority: 0.8 },
    { path: "/poker-roi-calculator", priority: 0.9 },
    { path: "/sports-betting-tracker", priority: 0.8 },
  ];

  return pages.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
