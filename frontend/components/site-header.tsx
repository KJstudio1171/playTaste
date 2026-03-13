"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { GlobalSearch } from "@/components/global-search";
import type { UserSummary } from "@/lib/types";

interface SiteHeaderProps {
  currentUser: UserSummary | null;
}

export function SiteHeader({ currentUser }: SiteHeaderProps) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "홈", active: pathname === "/" },
    { href: "/games", label: "게임 탐색", active: pathname.startsWith("/games") || pathname === "/search" },
    { href: "/rankings", label: "랭킹", active: pathname.startsWith("/rankings") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[rgba(252,247,241,0.92)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 xl:grid xl:grid-cols-[auto_minmax(280px,1fr)_auto_auto] xl:items-center">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-sm font-bold tracking-[0.2em] text-white shadow-[0_12px_26px_rgba(207,107,61,0.28)]">
              PT
            </div>
            <div className="min-w-0">
              <p className="eyebrow">게임 리뷰 플랫폼</p>
              <p className="display-title truncate text-2xl font-semibold">playTaste</p>
            </div>
          </Link>

          <div className="hidden xl:block xl:w-full xl:max-w-xl">
            <Suspense fallback={<div className="input-field h-11 rounded-full" />}>
              <GlobalSearch />
            </Suspense>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  link.active ? "bg-accent-soft text-accent-strong" : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {currentUser ? (
            <Link
              href={`/users/${currentUser.id}`}
              className="panel flex shrink-0 items-center gap-3 rounded-full px-3 py-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent-strong">
                {currentUser.display_name.slice(0, 1)}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold">{currentUser.display_name}</p>
                <p className="text-xs text-muted">@{currentUser.username}</p>
              </div>
            </Link>
          ) : (
            <Link href="/games" className="button-secondary hidden shrink-0 sm:inline-flex">
              게임 둘러보기
            </Link>
          )}
        </div>

        <div className="mt-3 xl:hidden">
          <Suspense fallback={<div className="input-field h-10 rounded-full" />}>
            <GlobalSearch compact />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
