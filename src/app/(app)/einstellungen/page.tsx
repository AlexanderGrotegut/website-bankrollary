import { Archive, Trash2 } from "lucide-react";
import {
  deleteTransactionAction,
} from "@/app/actions/bankroll";
import { archiveGameCategoryAction } from "@/app/actions/gameCategories";
import { archivePlatformAction } from "@/app/actions/platforms";
import { GameCategoryForm } from "@/components/settings/GameCategoryForm";
import { PlatformForm } from "@/components/settings/PlatformForm";
import {
  CurrencySettingsForm,
  TransactionForm,
} from "@/components/settings/SettingsForms";
import { requireUser } from "@/lib/auth";
import { formatMoney } from "@/lib/domain";
import { prisma } from "@/lib/prisma";

const transactionLabels = {
  STARTING_BALANCE: "Starting balance",
  DEPOSIT: "Deposit",
  WITHDRAWAL: "Withdrawal",
};

export default async function SettingsPage() {
  const user = await requireUser();
  const [settings, platforms, customCategories, transactions] = await Promise.all([
    prisma.userSettings.findUniqueOrThrow({ where: { userId: user.id } }),
    prisma.platform.findMany({
      where: { userId: user.id, archivedAt: null },
      orderBy: { name: "asc" },
      include: { _count: { select: { sessions: true } } },
    }),
    prisma.gameCategory.findMany({
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
        <div><p className="eyebrow">Configuration</p><h1>Settings</h1><p>Manage currencies, platforms, game types and your global bankroll.</p></div>
      </header>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="panel">
          <div className="panel-heading"><div><h2>Default currency</h2><p>Preselected for new sessions and currency conversion</p></div></div>
          <CurrencySettingsForm defaultCurrency={settings.defaultCurrency} />
        </section>
        <section className="panel">
          <div className="panel-heading"><div><h2>Platforms</h2><p>Your providers and venues</p></div></div>
          <PlatformForm compact />
          <div className="settings-list mt-5">
            {platforms.map((platform) => (
              <div key={platform.id}><span><strong>{platform.name}</strong><small>{platform._count.sessions} sessions</small></span><form action={archivePlatformAction}><input type="hidden" name="id" value={platform.id} /><button title="Archive"><Archive size={16} /></button></form></div>
            ))}
            {!platforms.length && <p className="empty-row">No platform created yet.</p>}
          </div>
        </section>
      </div>
      <section className="panel mt-6">
        <div className="panel-heading"><div><h2>Custom game types</h2><p>Only you can see and select the game types you create</p></div></div>
        <GameCategoryForm />
        <div className="settings-list mt-5">
          {customCategories.map((category) => (
            <div key={category.id}><span><strong>{category.name}</strong><small>{category._count.sessions} sessions</small></span><form action={archiveGameCategoryAction}><input type="hidden" name="id" value={category.id} /><button title="Archive"><Archive size={16} /></button></form></div>
          ))}
          {!customCategories.length && <p className="empty-row">No custom game types yet.</p>}
        </div>
      </section>
      <section className="panel mt-6">
        <div className="panel-heading"><div><h2>Bankroll transaction</h2><p>Deposits and withdrawals change your bankroll, but not your P/L. Withdrawals can take the balance below zero.</p></div></div>
        <TransactionForm defaultCurrency={settings.defaultCurrency} />
      </section>
      <section className="panel mt-6">
        <div className="panel-heading"><div><h2>Recent transactions</h2><p>Global bankroll movements</p></div></div>
        <div className="settings-list">
          {transactions.map((transaction) => {
            const signed = transaction.type === "WITHDRAWAL" ? -Number(transaction.amount) : Number(transaction.amount);
            return (
              <div key={transaction.id}><span><strong>{transactionLabels[transaction.type]}</strong><small>{transaction.note || transaction.occurredAt.toLocaleDateString("en-GB")}</small></span><span className={signed >= 0 ? "positive" : "negative"}>{formatMoney(signed, transaction.currency)}</span><form action={deleteTransactionAction}><input type="hidden" name="id" value={transaction.id} /><button title="Delete"><Trash2 size={16} /></button></form></div>
            );
          })}
          {!transactions.length && <p className="empty-row">No bankroll transactions yet.</p>}
        </div>
      </section>
    </>
  );
}
