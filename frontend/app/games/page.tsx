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
  if (params.sort) {
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
  const isSearch = query.length > 0;

  const results = isSearch
    ? await fetchBackendJson<PaginatedResponse<GameCardType>>(
        `/games/search?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`,
      )
    : await fetchBackendJson<PaginatedResponse<GameCardType>>(
        `/games?page=${page}&page_size=${pageSize}&sort=${sort}`,
      );

  const totalPages = Math.max(Math.ceil(results.total / results.page_size), 1);

  return (
    <main className="space-y-6">
      <section className="rounded-xl border border-line bg-background p-5 sm:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">{isSearch ? "검색 결과" : "게임 카탈로그"}</p>
            <h1 className="text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
              {isSearch ? `"${query}" 검색 결과` : "지금 플레이할 게임을 골라보세요"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted">
              {isSearch
                ? `${results.total}개의 결과를 찾았어요. 제목, 개발사, 퍼블리셔 이름으로 다시 좁혀볼 수 있어요.`
                : "최신순, 인기순, 평점순으로 흐름을 바꿔 보면서 마음에 드는 타이틀을 골라보세요."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((option) => {
              if (isSearch) {
                return (
                  <span
                    key={option.value}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                      option.value === sort ? "bg-accent text-white" : "border border-line text-foreground"
                    }`}
                  >
                    {option.label}
                  </span>
                );
              }

              const active = option.value === sort;
              return (
                <Link
                  key={option.value}
                  href={buildHref({ sort: option.value })}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    active ? "bg-accent text-white" : "border border-line text-foreground hover:border-accent hover:text-accent"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
          <SearchBox initialQuery={query} />
          <div className="rounded-[24px] bg-surface-muted/60 p-5">
            <p className="text-sm font-semibold text-foreground">
              {isSearch ? `${results.total}개의 검색 결과` : `총 ${results.total}개의 게임`}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {isSearch ? "검색 결과는 관련도 기준으로 보여줘요." : "원하는 정렬을 선택해 흐름을 빠르게 바꿔볼 수 있어요."}
            </p>
            {isSearch ? (
              <Link href={buildHref({ sort })} className="button-secondary mt-4 px-4 py-2 text-sm">
                전체 목록으로 돌아가기
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {results.items.length > 0 ? (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {results.items.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </section>
      ) : (
        <section className="rounded-xl border border-line p-6">
          <p className="text-base font-semibold">검색 결과가 없어요.</p>
          <p className="mt-2 text-sm leading-7 text-muted">
            다른 제목을 시도하거나 개발사 이름으로 다시 찾아보세요. 예: Hades, Nintendo, Atlus
          </p>
          <Link href="/games" className="button-secondary mt-5">
            전체 목록 보기
          </Link>
        </section>
      )}

      <section className="flex flex-col gap-4 rounded-xl border border-line p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">
            {results.page} / {totalPages} 페이지
          </p>
          <p className="mt-1 text-sm text-muted">
            현재 {results.items.length}개를 보고 있어요. 전체 결과는 {results.total}개입니다.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={buildHref({ page: Math.max(page - 1, 1), q: query || undefined, sort })}
            aria-disabled={page <= 1}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              page <= 1
                ? "cursor-not-allowed border border-line text-muted opacity-50"
                : "border border-line text-foreground transition hover:border-accent hover:text-accent-strong"
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
                : "bg-accent text-white transition hover:bg-accent-strong"
            }`}
          >
            다음
          </Link>
        </div>
      </section>
    </main>
  );
}
