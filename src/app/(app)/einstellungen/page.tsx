import { MessageSquarePlus } from "lucide-react";
import {
  DeleteGameCategoryButton,
  DeletePlatformButton,
  HideBuiltInGameCategoryButton,
  RestoreBuiltInGameCategoryButton,
} from "@/components/settings/DeleteSourceButton";
import {
  EmailForm,
  PasswordForm,
} from "@/components/settings/AccountForms";
import { FeedbackForm } from "@/components/settings/FeedbackForm";
import { GameCategoryForm } from "@/components/settings/GameCategoryForm";
import { PlatformForm } from "@/components/settings/PlatformForm";
import { CurrencySettingsForm } from "@/components/settings/SettingsForms";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const user = await requireUser();
  const [
    settings,
    platforms,
    builtInCategories,
    customCategories,
  ] = await Promise.all([
    prisma.userSettings.findUniqueOrThrow({ where: { userId: user.id } }),
    prisma.platform.findMany({
      where: { userId: user.id, archivedAt: null },
      orderBy: { name: "asc" },
      include: { _count: { select: { sessions: true } } },
    }),
    prisma.gameCategory.findMany({
      where: { userId: null, archivedAt: null },
      orderBy: { name: "asc" },
      include: {
        hiddenFor: {
          where: { userId: user.id },
          select: { userId: true },
        },
      },
    }),
    prisma.gameCategory.findMany({
      where: { userId: user.id, archivedAt: null },
      orderBy: { name: "asc" },
      include: { _count: { select: { sessions: true } } },
    }),
  ]);

  return (
    <>
      <header className="page-header">
        <div><p className="eyebrow">Configuration</p><h1>Settings</h1><p>Manage currencies, platforms and game types.</p></div>
      </header>
      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <section className="panel">
          <div className="panel-heading"><div><h2>Default currency</h2><p>Preselected for new sessions and currency conversion</p></div></div>
          <CurrencySettingsForm defaultCurrency={settings.defaultCurrency} />
        </section>
        <section className="panel">
          <div className="panel-heading"><div><h2>Platforms</h2><p>Your providers and venues</p></div></div>
          <PlatformForm compact />
          <div className="settings-list mt-5">
            {platforms.map((platform) => (
              <div key={platform.id}><span><strong>{platform.name}</strong><small>{platform._count.sessions} sessions</small></span><DeletePlatformButton id={platform.id} /></div>
            ))}
            {!platforms.length && <p className="empty-row">No platform created yet.</p>}
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading"><div><h2>Game types</h2><p>Built-in and custom types</p></div></div>
          <GameCategoryForm />
          <div className="settings-list mt-5">
            {builtInCategories.map((category) => {
              const hidden = category.hiddenFor.length > 0;
              return (
                <div key={category.id}>
                  <span>
                    <strong className={hidden ? "line-through opacity-50" : ""}>{category.name}</strong>
                    <small className="text-[var(--muted)]">built-in</small>
                  </span>
                  {hidden
                    ? <RestoreBuiltInGameCategoryButton id={category.id} />
                    : <HideBuiltInGameCategoryButton id={category.id} />}
                </div>
              );
            })}
            {customCategories.map((category) => (
              <div key={category.id}><span><strong>{category.name}</strong><small>{category._count.sessions} sessions</small></span><DeleteGameCategoryButton id={category.id} /></div>
            ))}
          </div>
        </section>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="panel">
          <div className="panel-heading"><div><h2>Email address</h2><p>Change the address you use to sign in</p></div></div>
          <EmailForm currentEmail={user.email ?? ""} />
        </section>
        <section className="panel">
          <div className="panel-heading"><div><h2>Password</h2><p>Use at least eight characters</p></div></div>
          <PasswordForm />
        </section>
      </div>
      <section className="panel mt-6">
        <div className="panel-heading">
          <div><h2><MessageSquarePlus size={18} className="mr-2 inline-block align-text-bottom" />Feedback &amp; Ideas</h2><p>Help us improve Bankrollary — your message goes directly to the team</p></div>
        </div>
        <FeedbackForm />
      </section>
    </>
  );
}
