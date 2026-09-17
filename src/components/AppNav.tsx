"use client";

import {
  BarChart3,
  History,
  LogOut,
  PlusCircle,
  Settings,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/sessions/neu", label: "Track session", icon: PlusCircle },
  { href: "/sessions", label: "Sessions", icon: History },
  { href: "/einstellungen", label: "Settings", icon: Settings },
];

export function AppNav({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="app-nav">
      <Link href="/dashboard" className="brand px-3" prefetch={false}>
        <span className="brand-mark">B</span>
        <span>Bankrollary</span>
      </Link>
      <nav className="mt-10 flex flex-1 gap-2 lg:flex-col">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
          return (
            <Link
              className={`nav-link ${active ? "nav-link-active" : ""}`}
              href={href}
              prefetch={false}
              key={href}
            >
              <Icon size={19} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 hidden border-t border-[var(--border)] pt-5 lg:block">
        <div className="mb-4 flex min-w-0 items-center gap-3 px-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
            <WalletCards size={17} />
          </span>
          <span className="truncate text-xs text-[var(--muted)]">{email}</span>
        </div>
        <form action={logoutAction}>
          <button className="nav-link w-full">
            <LogOut size={19} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
