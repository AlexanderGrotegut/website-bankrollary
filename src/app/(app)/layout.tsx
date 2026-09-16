import { AppNav } from "@/components/AppNav";
import { requireUser } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="app-shell">
      <AppNav email={user.email ?? "Account"} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-7 lg:px-10 lg:py-9">
        <div className="mx-auto max-w-[1440px]">{children}</div>
      </main>
    </div>
  );
}
