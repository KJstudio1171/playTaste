import Link from "next/link";

import { GameCard } from "@/components/game-card";
import { SearchBox } from "@/components/search-box";
import { fetchBackendJson } from "@/lib/api";
import type { GameCard as GameCardType, PaginatedResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "rating", label: "평점순" },
] as const;

interface GamesPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    sort?: string;
  }>;
}

function buildHref(params: { page?: number; q?: string; sort?: string }) {
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.set("q", params.q);
  }
  if (params.sort && !params.q) {
    searchParams.set("sort", params.sort);
  }
  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page));
  }

  const query = searchParams.toString();
  return query ? `/games?${query}` : "/games";
}

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Math.max(Number(resolvedSearchParams.page ?? "1") || 1, 1);
  const query = resolvedSearchParams.q?.trim() ?? "";
  const sort = SORT_OPTIONS.some((option) => option.value === resolvedSearchParams.sort)
    ? resolvedSearchParams.sort!
    : "latest";
  const pageSize = 12;

  const results = query
    ? await fetchBackendJson<PaginatedResponse<GameCardType>>(
        `/games/search?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`,
      )
    : await fetchBackendJson<PaginatedResponse<GameCardType>>(
        `/games?page=${page}&page_size=${pageSize}&sort=${sort}`,
      );

  const totalPages = Math.max(Math.ceil(results.total / results.page_size), 1);

  return (
    <main className="space-y-8">
      <SearchBox initialQuery={query} />

      <section className="space-y-5">
        <div className="panel rounded-[28px] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">{query ? "search results" : "game catalog"}</p>
              <h2 className="display-title mt-2 text-4xl font-semibold">
                {query ? `"${query}" 검색 결과` : "실제로 탐색 가능한 게임 목록"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                {query
                  ? `${results.total}개의 결과를 찾았습니다. 검색어를 바꾸면 즉시 다시 탐색할 수 있습니다.`
                  : "최신순, 인기순, 평점순으로 정렬하면서 상세 페이지로 바로 이동할 수 있습니다."}
              </p>
            </div>

            {query ? (
              <Link
                href="/games"
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent"
              >
                검색 해제
              </Link>
            ) : (
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((option) => {
                  const active = option.value === sort;
                  return (
                    <Link
                      key={option.value}
                      href={buildHref({ sort: option.value })}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? "bg-accent text-white"
                          : "border border-line text-foreground hover:border-accent hover:text-accent"
                      }`}
                    >
                      {option.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {results.items.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {results.items.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="panel rounded-[28px] p-6 text-sm leading-7 text-muted">
            결과가 없습니다. 다른 제목이나 스튜디오 이름으로 다시 검색해 보세요.
          </div>
        )}
      </section>

      <section className="panel flex flex-wrap items-center justify-between gap-4 rounded-[28px] p-5">
        <div>
          <p className="text-sm font-semibold">Page {results.page}</p>
          <p className="mt-1 text-sm text-muted">
            총 {results.total}개 중 {results.items.length}개 표시, 전체 {totalPages}페이지
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={buildHref({ page: Math.max(page - 1, 1), q: query || undefined, sort })}
            aria-disabled={page <= 1}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              page <= 1
                ? "cursor-not-allowed border border-line text-muted opacity-50"
                : "border border-line text-foreground transition hover:border-accent hover:text-accent"
            }`}
          >
            이전
          </Link>
          <Link
            href={buildHref({ page: Math.min(page + 1, totalPages), q: query || undefined, sort })}
            aria-disabled={page >= totalPages}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              page >= totalPages
                ? "cursor-not-allowed border border-line text-muted opacity-50"
                : "bg-accent text-white transition hover:brightness-105"
            }`}
          >
            다음
          </Link>
        </div>
      </section>
    </main>
  );
}
