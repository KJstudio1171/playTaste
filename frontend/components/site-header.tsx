"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { GlobalSearch } from "@/components/global-search";
import type { UserSummary } from "@/lib/types";

interface SiteHeaderProps {
  currentUser: UserSummary | null;
}

const NAV_LINKS = [
  { href: "/", label: "홈", match: (p: string) => p === "/" },
  { href: "/games", label: "게임", match: (p: string) => p.startsWith("/games") || p === "/search" },
  { href: "/rankings", label: "랭킹", match: (p: string) => p.startsWith("/rankings") },
];

export function SiteHeader({ currentUser }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md">
      {/* 메인 헤더 */}
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 text-base font-extrabold tracking-[-0.04em] text-foreground">
          play<span className="text-accent">Taste</span>
        </Link>

        <div className="hidden max-w-xs flex-1 sm:block lg:max-w-sm">
          <Suspense fallback={<div className="input-field h-9" />}>
            <GlobalSearch />
          </Suspense>
        </div>

        {currentUser ? (
          <Link
            href={`/users/${currentUser.id}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm font-semibold transition hover:border-accent hover:text-accent"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
              {currentUser.display_name.slice(0, 1)}
            </div>
            <span className="hidden sm:inline">{currentUser.display_name}</span>
          </Link>
        ) : (
          <Link href="/games" className="button-secondary shrink-0 py-1.5 text-sm">
            게임 둘러보기
          </Link>
        )}
      </div>

      {/* 모바일 검색 */}
      <div className="border-t border-line px-4 py-2 sm:hidden">
        <Suspense fallback={<div className="input-field h-9" />}>
          <GlobalSearch />
        </Suspense>
      </div>

      {/* 서브메뉴 탭 */}
      <div className="mx-auto flex max-w-[1120px] overflow-x-auto px-4 scrollbar-none sm:px-6 lg:px-8">
        {NAV_LINKS.map((link) => {
          const active = link.match(pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
