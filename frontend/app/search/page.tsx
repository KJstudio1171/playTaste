import { GameCard } from "@/components/game-card";
import { SearchBox } from "@/components/search-box";
import { SectionHeading } from "@/components/section-heading";
import { fetchBackendJson } from "@/lib/api";
import type { GameCard as GameCardType, PaginatedResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q?.trim() ?? "";
  const results = query
    ? await fetchBackendJson<PaginatedResponse<GameCardType>>(
        `/games/search?q=${encodeURIComponent(query)}&page_size=12`,
      )
    : null;

  return (
    <main className="space-y-8">
      <SearchBox initialQuery={query} />

      <section>
        <SectionHeading
          eyebrow="search results"
          title={query ? `"${query}" 검색 결과` : "원하는 게임을 검색해 보세요"}
          description={
            query
              ? `${results?.total ?? 0}개의 결과를 찾았습니다.`
              : "제목, 개발사, 퍼블리셔 키워드로 카탈로그를 탐색할 수 있습니다."
          }
        />

        {!query ? (
          <div className="panel rounded-[28px] p-6 text-sm leading-7 text-muted">
            검색어를 입력하면 결과가 즉시 갱신됩니다. MVP에서는 부분 일치 검색을 지원합니다.
          </div>
        ) : results && results.items.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {results.items.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="panel rounded-[28px] p-6 text-sm leading-7 text-muted">
            검색 결과가 없습니다. 다른 제목이나 스튜디오 이름으로 다시 시도해 보세요.
          </div>
        )}
      </section>
    </main>
  );
}
