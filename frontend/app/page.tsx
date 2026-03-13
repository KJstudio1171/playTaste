import Link from "next/link";

import { GameCard } from "@/components/game-card";
import { SectionHeading } from "@/components/section-heading";
import { fetchBackendJson } from "@/lib/api";
import { formatCompactCount } from "@/lib/format";
import type { GameCard as GameCardType, PaginatedResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [popular, latest, rankings] = await Promise.all([
    fetchBackendJson<PaginatedResponse<GameCardType>>("/games/popular?page_size=4"),
    fetchBackendJson<PaginatedResponse<GameCardType>>("/games/latest?page_size=4"),
    fetchBackendJson<PaginatedResponse<GameCardType>>("/games/rankings?page_size=4"),
  ]);

  return (
    <main className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="panel rounded-[36px] px-7 py-8 sm:px-10 sm:py-10">
          <p className="eyebrow">watchapedia-inspired mvp</p>
          <h1 className="display-title mt-3 max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl">
            오늘 밤 플레이할 게임을 찾고, 바로 평점과 리뷰를 남기세요.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
            인기 게임, 최신 게임, 상위 평점 랭킹을 한 번에 훑고 상세 페이지에서 바로 별점과 리뷰를 남길 수 있는
            게임 평점 플랫폼 MVP입니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/search" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white">
              게임 검색하기
            </Link>
            <Link
              href="/rankings"
              className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-foreground"
            >
              랭킹 보기
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="panel rounded-[28px] p-6">
            <p className="eyebrow">popular pulse</p>
            <p className="mt-3 text-4xl font-semibold">{formatCompactCount(popular.total)}</p>
            <p className="mt-2 text-sm leading-6 text-muted">시드 데이터 기반으로 바로 탐색 가능한 인기 게임 수</p>
          </div>
          <div className="panel rounded-[28px] p-6">
            <p className="eyebrow">latest drop</p>
            <p className="mt-3 text-4xl font-semibold">{formatCompactCount(latest.total)}</p>
            <p className="mt-2 text-sm leading-6 text-muted">최신 출시 순으로 정렬된 게임 카탈로그</p>
          </div>
          <div className="panel rounded-[28px] p-6">
            <p className="eyebrow">top rated</p>
            <p className="mt-3 text-4xl font-semibold">{formatCompactCount(rankings.total)}</p>
            <p className="mt-2 text-sm leading-6 text-muted">평균 평점과 참여 수를 반영한 랭킹 기준 게임 수</p>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="popular games"
          title="지금 가장 많이 회자되는 게임"
          description="rating_count, review_count, avg_rating 순으로 정렬한 인기 섹션입니다."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {popular.items.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="latest games"
          title="최근 출시 중심으로 훑는 신작 라인업"
          description="release_date를 기준으로 빠르게 최신 타이틀을 확인할 수 있습니다."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {latest.items.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="top rankings"
          title="평점이 가장 높은 게임"
          description="avg_rating, rating_count, review_count 조합으로 정렬한 상위권입니다."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {rankings.items.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </main>
  );
}
