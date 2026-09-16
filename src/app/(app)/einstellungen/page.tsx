import { Archive, Trash2 } from "lucide-react";
import {
  deleteTransactionAction,
} from "@/app/actions/bankroll";
import { archivePlatformAction } from "@/app/actions/platforms";
import { PlatformForm } from "@/components/settings/PlatformForm";
import {
  CurrencySettingsForm,
  TransactionForm,
} from "@/components/settings/SettingsForms";
import { requireUser } from "@/lib/auth";
import { formatMoney } from "@/lib/domain";
import { prisma } from "@/lib/prisma";

const transactionLabels = {
  STARTING_BALANCE: "Startguthaben",
  DEPOSIT: "Einzahlung",
  WITHDRAWAL: "Auszahlung",
};

export default async function SettingsPage() {
  const user = await requireUser();
  const [settings, platforms, transactions] = await Promise.all([
    prisma.userSettings.findUniqueOrThrow({ where: { userId: user.id } }),
    prisma.platform.findMany({
      where: { userId: user.id, archivedAt: null },
      orderBy: { name: "asc" },
      include: { _count: { select: { sessions: true } } },
    }),
    prisma.bankrollTransaction.findMany({
      where: { userId: user.id },
      orderBy: { occurredAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <>
      <header className="page-header">
        <div><p className="eyebrow">Konfiguration</p><h1>Einstellungen</h1><p>Währungen, Plattformen und deine globale Bankroll verwalten.</p></div>
      </header>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="panel">
          <div className="panel-heading"><div><h2>Standardwährung</h2><p>Wird bei neuen Sessions vorausgewählt</p></div></div>
          <CurrencySettingsForm defaultCurrency={settings.defaultCurrency} />
        </section>
        <section className="panel">
          <div className="panel-heading"><div><h2>Plattformen</h2><p>Eigene Anbieter und Spielorte</p></div></div>
          <PlatformForm compact />
          <div className="settings-list mt-5">
            {platforms.map((platform) => (
              <div key={platform.id}><span><strong>{platform.name}</strong><small>{platform._count.sessions} Sessions</small></span><form action={archivePlatformAction}><input type="hidden" name="id" value={platform.id} /><button title="Archivieren"><Archive size={16} /></button></form></div>
            ))}
            {!platforms.length && <p className="empty-row">Noch keine Plattform angelegt.</p>}
          </div>
        </section>
      </div>
      <section className="panel mt-6">
        <div className="panel-heading"><div><h2>Bankroll-Buchung</h2><p>Startguthaben sowie Ein- und Auszahlungen verändern die Bankroll, aber nicht dein P/L.</p></div></div>
        <TransactionForm defaultCurrency={settings.defaultCurrency} />
      </section>
      <section className="panel mt-6">
        <div className="panel-heading"><div><h2>Letzte Buchungen</h2><p>Globale Bankroll-Bewegungen</p></div></div>
        <div className="settings-list">
          {transactions.map((transaction) => {
            const signed = transaction.type === "WITHDRAWAL" ? -Number(transaction.amount) : Number(transaction.amount);
            return (
              <div key={transaction.id}><span><strong>{transactionLabels[transaction.type]}</strong><small>{transaction.note || transaction.occurredAt.toLocaleDateString("de-DE")}</small></span><span className={signed >= 0 ? "positive" : "negative"}>{formatMoney(signed, transaction.currency)}</span><form action={deleteTransactionAction}><input type="hidden" name="id" value={transaction.id} /><button title="Löschen"><Trash2 size={16} /></button></form></div>
            );
          })}
          {!transactions.length && <p className="empty-row">Noch keine Bankroll-Buchung vorhanden.</p>}
        </div>
      </section>
    </>
  );
}
