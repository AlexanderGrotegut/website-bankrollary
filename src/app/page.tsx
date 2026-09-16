import { ArrowRight, BarChart3, Check, Clock3, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <Link href="/" className="brand"><span className="brand-mark">B</span>Bankrollary</Link>
        <div className="flex items-center gap-3"><Link href="/login" className="button-ghost">Sign in</Link><Link href="/registrieren" className="button-primary">Start for free</Link></div>
      </nav>
      <main>
        <section className="landing-hero">
          <div className="hero-glow" />
          <div className="relative mx-auto max-w-5xl text-center">
            <p className="landing-badge"><Sparkles size={15} /> Smarter Bankroll Tracker</p>
            <h1>Bankrollary - Your Bankroll Diary</h1>
            <p className="hero-copy">Watch your Bankroll grow!</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/registrieren" className="button-primary button-large">Start your diary <ArrowRight size={18} /></Link>
              <a href="#so-gehts" className="button-secondary button-large">How it works</a>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-6 text-sm text-[var(--muted)]">
              <span><Check size={15} /> Start for free</span><span><Check size={15} /> Multiple currencies</span><span><ShieldCheck size={15} /> Private data</span>
            </div>
          </div>
          <div className="hero-preview"><DashboardPreview /></div>
        </section>

        <section id="so-gehts" className="landing-section">
          <div className="section-intro"><p className="eyebrow">Three simple steps</p><h2>From every stake to a clear decision</h2><p>The app guides you through your personal bankroll diary without complicated spreadsheets.</p></div>
          <Guide number="01" title="Track a session in seconds" text="Choose a game type and platform, then add your buy-in and cash-out. The start time is ready for you." bullets={["Create your own platforms", "Complete running sessions later", "Automatic P/L, ROI and hourly rate"]}><SessionPreview /></Guide>
          <Guide number="02" title="Understand your development" text="Your dashboard turns individual sessions into a clear trend, separated by currency." bullets={["Weekly, monthly and yearly views", "Bankroll graph and key metrics", "Deposits and withdrawals kept separate"]} reverse><AnalyticsPreview /></Guide>
          <Guide number="03" title="Filter your history and learn" text="Find sessions by type, platform, date or currency and export your data as CSV." bullets={["Edit every session", "Compare platforms", "Your data stays yours"]}><HistoryPreview /></Guide>
        </section>

        <section className="landing-cta">
          <LineChart size={32} /><h2>Ready for clarity about your bankroll?</h2>
          <p>Start your personal bankroll diary today.</p>
          <Link href="/registrieren" className="button-primary button-large">Create your free account <ArrowRight size={18} /></Link>
        </section>
      </main>
      <footer className="landing-footer"><span className="brand"><span className="brand-mark">B</span>Bankrollary</span><p>Track smart. Play responsible.</p></footer>
    </div>
  );
}

function Guide({ number, title, text, bullets, reverse, children }: { number: string; title: string; text: string; bullets: string[]; reverse?: boolean; children: React.ReactNode }) {
  return <div className={`guide-step ${reverse ? "reverse" : ""}`}><div className="step-copy"><span>{number}</span><h3>{title}</h3><p>{text}</p><ul>{bullets.map((bullet) => <li key={bullet}><Check />{bullet}</li>)}</ul></div>{children}</div>;
}

function DashboardPreview() {
  return <div className="product-shot"><ShotBar title="Overview" /><div className="shot-content"><div className="shot-metrics"><ShotMetric label="Bankroll" value="€4,860" /><ShotMetric label="P/L" value="+€742" green /><ShotMetric label="ROI" value="+18.4%" green /><ShotMetric label="Sessions" value="28" /></div><ShotChart path="M0 165 C90 145 100 155 170 120 S270 150 340 98 S450 115 520 62 S610 75 700 25" /></div></div>;
}

function SessionPreview() {
  return <div className="product-shot compact"><ShotBar title="New session" /><div className="shot-form"><ShotField label="Game type" value="Poker" /><ShotField label="Platform" value="PokerStars" /><ShotField label="Buy-in" value="€100.00" /><ShotField label="Cash-out" value="€164.00" /><div className="shot-result"><span>P/L<strong>+€64.00</strong></span><span>ROI<strong>+64.0%</strong></span><span>Duration<strong>2 hr 14 min</strong></span></div></div></div>;
}

function AnalyticsPreview() {
  return <div className="product-shot compact"><ShotBar title="Monthly overview" /><div className="shot-content"><div className="shot-tabs"><b>Week</b><b className="active">Month</b><b>Year</b></div><ShotChart path="M0 155 C90 120 160 165 235 110 S360 125 430 74 S560 100 700 34" /></div></div>;
}

function HistoryPreview() {
  const rows = [["Poker", "PokerStars", "+€164.00"], ["Sports Betting", "Tipico", "-€35.00"], ["Stocks", "Trading 212", "+€82.00"]];
  return <div className="product-shot compact"><ShotBar title="Session archive" /><div className="shot-list">{rows.map(([type, platform, result]) => <div key={type}><span className="shot-icon"><BarChart3 size={16} /></span><span><strong>{type}</strong><small>{platform}</small></span><time><Clock3 size={13} /> Today</time><b className={result.startsWith("+") ? "positive" : "negative"}>{result}</b></div>)}</div></div>;
}

function ShotChart({ path }: { path: string }) {
  return <div className="shot-chart"><svg viewBox="0 0 700 190" role="img" aria-label="Bankroll chart"><path className="area" d={`${path} L700 190 L0 190Z`} /><path className="line" d={path} /></svg></div>;
}

function ShotBar({ title }: { title: string }) { return <div className="shot-bar"><div><i /><i /><i /></div><strong>{title}</strong><span /></div>; }
function ShotMetric({ label, value, green }: { label: string; value: string; green?: boolean }) { return <div><span>{label}</span><strong className={green ? "positive" : ""}>{value}</strong></div>; }
function ShotField({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div>; }
