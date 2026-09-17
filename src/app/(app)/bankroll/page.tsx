import { Trash2 } from "lucide-react";
import { deleteTransactionAction } from "@/app/actions/bankroll";
import { TransactionForm } from "@/components/settings/SettingsForms";
import { requireUser } from "@/lib/auth";
import { formatMoney } from "@/lib/domain";
import { prisma } from "@/lib/prisma";

const transactionLabels = {
  STARTING_BALANCE: "Starting balance",
  DEPOSIT: "Deposit",
  WITHDRAWAL: "Withdrawal",
};

export default async function BankrollPage() {
  const user = await requireUser();
  const [settings, transactions] = await Promise.all([
    prisma.userSettings.findUniqueOrThrow({ where: { userId: user.id } }),
    prisma.bankrollTransaction.findMany({
      where: { userId: user.id },
      orderBy: { occurredAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Manage your bankroll</p>
          <h1>Bankroll</h1>
          <p>Deposits and withdrawals change your bankroll, but not your P/L.</p>
        </div>
      </header>
      <section className="panel mt-8">
        <div className="panel-heading"><div><h2>New transaction</h2><p>Withdrawals can take the balance below zero</p></div></div>
        <TransactionForm defaultCurrency={settings.defaultCurrency} />
      </section>
      <section className="panel mt-6">
        <div className="panel-heading"><div><h2>Recent transactions</h2><p>Global bankroll movements</p></div></div>
        <div className="settings-list">
          {transactions.map((transaction) => {
            const signed = transaction.type === "WITHDRAWAL" ? -Number(transaction.amount) : Number(transaction.amount);
            return (
              <div key={transaction.id}>
                <span>
                  <strong>{transactionLabels[transaction.type]}</strong>
                  <small>{transaction.note || transaction.occurredAt.toLocaleDateString("en-GB")}</small>
                </span>
                <span className={signed >= 0 ? "positive" : "negative"}>{formatMoney(signed, transaction.currency)}</span>
                <form action={deleteTransactionAction}>
                  <input type="hidden" name="id" value={transaction.id} />
                  <button title="Delete"><Trash2 size={16} /></button>
                </form>
              </div>
            );
          })}
          {!transactions.length && <p className="empty-row">No bankroll transactions yet.</p>}
        </div>
      </section>
    </>
  );
}
