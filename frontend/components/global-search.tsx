"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface GlobalSearchProps {
  placeholder?: string;
  compact?: boolean;
}

export function GlobalSearch({
  placeholder = "게임, 개발사, 퍼블리셔를 검색해 보세요",
  compact = false,
}: GlobalSearchProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeQuery =
    pathname.startsWith("/games") || pathname === "/search" ? searchParams.get("q") ?? "" : "";

  return <SearchForm key={`${pathname}-${routeQuery}`} compact={compact} initialQuery={routeQuery} placeholder={placeholder} />;
}

interface SearchFormProps extends GlobalSearchProps {
  initialQuery: string;
}

function SearchForm({ initialQuery, placeholder, compact = false }: SearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = query.trim();
    const nextParams = pathname.startsWith("/games")
      ? new URLSearchParams(searchParams.toString())
      : new URLSearchParams();

    nextParams.delete("page");

    if (normalized) {
      nextParams.set("q", normalized);
    } else {
      nextParams.delete("q");
    }

    const nextQuery = nextParams.toString();
    router.push(nextQuery ? `/games?${nextQuery}` : "/games");
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted ${compact ? "h-4 w-4" : "h-5 w-5"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" strokeLinecap="round" />
      </svg>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className={`input-field rounded-full pl-11 pr-24 ${compact ? "py-2.5 text-sm" : "py-3 text-sm"}`}
      />
      <button
        type="submit"
        className={`absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-accent px-3.5 font-semibold text-white transition hover:bg-accent-strong ${compact ? "py-1.5 text-xs" : "py-2 text-sm"}`}
      >
        검색
      </button>
    </form>
  );
}
