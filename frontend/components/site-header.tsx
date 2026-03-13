import Link from "next/link";

import type { UserSummary } from "@/lib/types";

interface SiteHeaderProps {
  currentUser: UserSummary | null;
}

export function SiteHeader({ currentUser }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-[rgba(255,250,244,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-sm font-bold tracking-[0.2em] text-white">
            PT
          </div>
          <div>
            <p className="eyebrow">game rating mvp</p>
            <p className="display-title text-2xl font-semibold">playTaste</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
          <Link href="/">Home</Link>
          <Link href="/games">Games</Link>
          <Link href="/rankings">Rankings</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/games"
            className="rounded-full border border-line px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
          >
            Browse Games
          </Link>
          {currentUser ? (
            <Link
              href={`/users/${currentUser.id}`}
              className="panel flex items-center gap-3 rounded-full px-3 py-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                {currentUser.display_name.slice(0, 1)}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold">{currentUser.display_name}</p>
                <p className="text-xs text-muted">@{currentUser.username}</p>
              </div>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
