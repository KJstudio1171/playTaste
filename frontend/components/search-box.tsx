"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          id="catalog-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="예: Elden Ring, Atlus, Nintendo"
          className="rounded-full py-3 pl-11 pr-12"
        />
        {query ? (
          <Button
            type="button"
            onClick={() => setQuery("")}
            variant="ghost"
            size="icon-xs"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full text-muted hover:text-foreground"
            aria-label="검색어 지우기"
          >
            <X />
          </Button>
        ) : null}
      </div>
      <p className="text-sm leading-6 text-muted">제목, 개발사, 퍼블리셔 이름으로 바로 찾을 수 있어요.</p>
    </div>
  );
}
