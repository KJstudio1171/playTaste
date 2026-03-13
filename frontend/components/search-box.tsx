"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SearchBoxProps {
  initialQuery: string;
}

export function SearchBox({ initialQuery }: SearchBoxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const normalized = deferredQuery.trim();
    const current = searchParams.get("q") ?? "";

    if (normalized === current) {
      return;
    }

    const timer = window.setTimeout(() => {
      startTransition(() => {
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.delete("page");

        if (normalized) {
          nextParams.set("q", normalized);
        } else {
          nextParams.delete("q");
        }

        const nextQuery = nextParams.toString();
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
      });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [deferredQuery, pathname, router, searchParams]);

  return (
    <div className="space-y-3">
      <label htmlFor="catalog-search" className="text-sm font-semibold text-foreground">
        게임 검색
      </label>
      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" strokeLinecap="round" />
        </svg>
        <input
          id="catalog-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="예: Elden Ring, Atlus, Nintendo"
          className="input-field rounded-full py-3 pl-11 pr-12 text-sm"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs font-semibold text-muted transition hover:text-foreground"
          >
            지우기
          </button>
        ) : null}
      </div>
      <p className="text-sm leading-6 text-muted">제목, 개발사, 퍼블리셔 이름으로 바로 찾을 수 있어요.</p>
    </div>
  );
}
