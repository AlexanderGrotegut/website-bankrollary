import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

type ContentSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  sections: ContentSection[];
  faq: FaqItem[];
  children?: React.ReactNode;
};

const resources = [
  { href: "/poker-bankroll-tracker", label: "Poker Bankroll Tracker" },
  { href: "/bankroll-management-guide", label: "Bankroll Management Guide" },
  { href: "/poker-roi-calculator", label: "Poker ROI Calculator" },
  { href: "/sports-betting-tracker", label: "Sports Betting Tracker" },
];

export function SeoPage({
  eyebrow,
  title,
  description,
  sections,
  faq,
  children,
}: Props) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <div className="landing seo-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <nav className="landing-nav">
        <Link href="/" className="brand">
          <span className="brand-mark">B</span>Bankrollary
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="button-ghost">Sign in</Link>
          <Link href="/registrieren" className="button-primary">Start free</Link>
        </div>
      </nav>
      <main>
        <header className="seo-hero">
          <Link href="/" className="text-link">Bankrollary</Link>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
          <Link href="/registrieren" className="button-primary button-large">
            Start tracking for free <ArrowRight size={18} />
          </Link>
        </header>
        <div className="seo-article-layout">
          <article className="seo-article">
            {children}
            {sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}><Check size={18} />{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <section>
              <h2>Frequently asked questions</h2>
              <div className="seo-faq">
                {faq.map((item) => (
                  <details key={item.question}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </article>
          <aside className="seo-resources">
            <h2>Free bankroll resources</h2>
            {resources.map((resource) => (
              <Link href={resource.href} key={resource.href}>
                {resource.label}<ArrowRight size={15} />
              </Link>
            ))}
          </aside>
        </div>
      </main>
      <footer className="landing-footer">
        <Link href="/" className="brand"><span className="brand-mark">B</span>Bankrollary</Link>
        <p>No hidden costs. Track smart. Play responsible.</p>
      </footer>
    </div>
  );
}
