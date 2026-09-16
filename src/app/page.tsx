import { ArrowRight, BarChart3, Check, Clock3, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <Link href="/" className="brand"><span className="brand-mark">B</span>Bankrollary</Link>
        <div className="flex items-center gap-3"><Link href="/login" className="button-ghost">Anmelden</Link><Link href="/registrieren" className="button-primary">Kostenlos starten</Link></div>
      </nav>
      <main>
        <section className="landing-hero">
          <div className="hero-glow" />
          <div className="relative mx-auto max-w-5xl text-center">
            <p className="landing-badge"><Sparkles size={15} /> Smarter Bankroll Tracker</p>
            <h1>Bankrollary - Start your Diary for your Bankroll</h1>
            <p className="hero-copy">Dokumentiere jede Session, erkenne deine echten Stärken und sieh auf einen Blick, wie sich deine Bankroll entwickelt.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/registrieren" className="button-primary button-large">Jetzt Diary starten <ArrowRight size={18} /></Link>
              <a href="#so-gehts" className="button-secondary button-large">So funktioniert&apos;s</a>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-6 text-sm text-[var(--muted)]">
              <span><Check size={15} /> Kostenlos starten</span><span><Check size={15} /> Mehrere Währungen</span><span><ShieldCheck size={15} /> Private Daten</span>
            </div>
          </div>
          <div className="hero-preview"><DashboardPreview /></div>
        </section>

        <section id="so-gehts" className="landing-section">
          <div className="section-intro"><p className="eyebrow">In drei Schritten</p><h2>Vom Einsatz zur klaren Entscheidung</h2><p>Die App führt dich ohne komplizierte Tabellen durch dein persönliches Bankroll-Diary.</p></div>
          <Guide number="01" title="Session in Sekunden eintragen" text="Wähle Spieltyp und Plattform, ergänze Buy-in und Cash-out. Startzeit ist automatisch vorausgefüllt." bullets={["Eigene Plattformen anlegen", "Laufende Sessions später beenden", "P/L, ROI und Stundenlohn automatisch"]}><SessionPreview /></Guide>
          <Guide number="02" title="Entwicklung wirklich verstehen" text="Dein Dashboard macht aus einzelnen Sessions eine klare Entwicklung – getrennt nach Währung." bullets={["Wochen-, Monats- und Jahresansicht", "Bankroll-Graph und Kennzahlen", "Ein- und Auszahlungen korrekt getrennt"]} reverse><AnalyticsPreview /></Guide>
          <Guide number="03" title="Historie filtern und lernen" text="Finde alte Sessions nach Typ, Plattform, Zeitraum oder Währung und exportiere deine Daten als CSV." bullets={["Jede Session bearbeiten", "Plattform-Vergleiche", "Deine Daten bleiben deine"]}><HistoryPreview /></Guide>
        </section>

        <section className="landing-cta">
          <LineChart size={32} /><h2>Bereit für Klarheit über deine Bankroll?</h2>
          <p>Starte heute dein persönliches Bankroll-Diary.</p>
          <Link href="/registrieren" className="button-primary button-large">Kostenlosen Account erstellen <ArrowRight size={18} /></Link>
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
  return <div className="product-shot"><ShotBar title="Übersicht" /><div className="shot-content"><div className="shot-metrics"><ShotMetric label="Bankroll" value="€ 4.860" /><ShotMetric label="P/L" value="+ € 742" green /><ShotMetric label="ROI" value="+ 18,4 %" green /><ShotMetric label="Sessions" value="28" /></div><ShotChart path="M0 165 C90 145 100 155 170 120 S270 150 340 98 S450 115 520 62 S610 75 700 25" /></div></div>;
}

function SessionPreview() {
  return <div className="product-shot compact"><ShotBar title="Neue Session" /><div className="shot-form"><ShotField label="Typ" value="Poker" /><ShotField label="Plattform" value="PokerStars" /><ShotField label="Buy-in" value="100,00 EUR" /><ShotField label="Cash-out" value="164,00 EUR" /><div className="shot-result"><span>P/L<strong>+64,00 €</strong></span><span>ROI<strong>+64,0 %</strong></span><span>Dauer<strong>2 Std. 14 Min.</strong></span></div></div></div>;
}

function AnalyticsPreview() {
  return <div className="product-shot compact"><ShotBar title="Monatsübersicht" /><div className="shot-content"><div className="shot-tabs"><b>Woche</b><b className="active">Monat</b><b>Jahr</b></div><ShotChart path="M0 155 C90 120 160 165 235 110 S360 125 430 74 S560 100 700 34" /></div></div>;
}

function HistoryPreview() {
  const rows = [["Poker", "PokerStars", "+ 164,00 €"], ["Sports Betting", "Tipico", "- 35,00 €"], ["Blackjack", "Casino Kiel", "+ 82,00 €"]];
  return <div className="product-shot compact"><ShotBar title="Session-Archiv" /><div className="shot-list">{rows.map(([type, platform, result]) => <div key={type}><span className="shot-icon"><BarChart3 size={16} /></span><span><strong>{type}</strong><small>{platform}</small></span><time><Clock3 size={13} /> Heute</time><b className={result.startsWith("+") ? "positive" : "negative"}>{result}</b></div>)}</div></div>;
}

function ShotChart({ path }: { path: string }) {
  return <div className="shot-chart"><svg viewBox="0 0 700 190" role="img" aria-label="Bankroll-Kurve"><path className="area" d={`${path} L700 190 L0 190Z`} /><path className="line" d={path} /></svg></div>;
}

function ShotBar({ title }: { title: string }) { return <div className="shot-bar"><div><i /><i /><i /></div><strong>{title}</strong><span /></div>; }
function ShotMetric({ label, value, green }: { label: string; value: string; green?: boolean }) { return <div><span>{label}</span><strong className={green ? "positive" : ""}>{value}</strong></div>; }
function ShotField({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div>; }
