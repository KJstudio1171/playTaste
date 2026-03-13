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
    <div className="panel rounded-[28px] p-5">
      <p className="eyebrow">search</p>
      <h1 className="display-title mt-2 text-4xl font-semibold">지금 찾고 싶은 게임</h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        제목, 개발사, 퍼블리셔 일부만 입력해도 결과를 좁힐 수 있습니다.
      </p>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Elden Ring, Atlus, Nintendo..."
        className="mt-5 w-full rounded-full border border-line bg-white/85 px-5 py-4 text-base outline-none transition focus:border-accent"
      />
    </div>
  );
}
