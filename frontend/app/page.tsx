import Link from "next/link";

import { GameCard } from "@/components/game-card";
import { SectionHeading } from "@/components/section-heading";
import { fetchBackendJson } from "@/lib/api";
import { formatCompactCount } from "@/lib/format";
import type { GameCard as GameCardType, PaginatedResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

function GameShelf({ items }: { items: GameCardType[] }) {
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4">
      {items.map((game) => (
        <div key={game.id} className="w-[240px] shrink-0 sm:w-auto">
          <GameCard game={game} />
        </div>
      ))}
    </div>
  );
}

export default async function Home() {
  const [popular, latest, rankings] = await Promise.all([
    fetchBackendJson<PaginatedResponse<GameCardType>>("/games/popular?page_size=4"),
    fetchBackendJson<PaginatedResponse<GameCardType>>("/games/latest?page_size=4"),
    fetchBackendJson<PaginatedResponse<GameCardType>>("/rankings?type=rating&page_size=4"),
  ]);

  return (
    <main className="space-y-10">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="panel-featured rounded-[32px] p-7 sm:p-8">
          <p className="eyebrow">탐색 허브</p>
          <h1 className="display-title mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            지금 볼 게임을 찾고, 별점과 리뷰까지 바로 남겨보세요.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            인기 게임과 최신 추가 타이틀, 평점 상위 작품을 빠르게 훑고 상세 페이지에서 바로 평가할 수 있는
            게임 리뷰 허브입니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/games" className="button-primary">
              게임 탐색하기
            </Link>
            <Link href="/rankings" className="button-secondary">
              평점 랭킹 보기
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-sm text-muted">
            <span className="chip">빠른 검색</span>
            <span className="chip">즉시 별점</span>
            <span className="chip">상세 리뷰</span>
            <span className="chip">랭킹 탐색</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <div className="stat-tile rounded-[28px] p-5">
            <p className="eyebrow">popular</p>
            <p className="mt-3 text-3xl font-semibold">{formatCompactCount(popular.total)}</p>
            <p className="mt-2 text-sm leading-6 text-muted">지금 가장 활발하게 평가되고 있는 게임</p>
          </div>
          <div className="stat-tile rounded-[28px] p-5">
            <p className="eyebrow">latest</p>
            <p className="mt-3 text-3xl font-semibold">{formatCompactCount(latest.total)}</p>
            <p className="mt-2 text-sm leading-6 text-muted">최근 추가된 타이틀을 바로 훑어볼 수 있어요</p>
          </div>
          <div className="stat-tile rounded-[28px] p-5">
            <p className="eyebrow">top rated</p>
            <p className="mt-3 text-3xl font-semibold">{formatCompactCount(rankings.total)}</p>
            <p className="mt-2 text-sm leading-6 text-muted">평점이 가장 높은 작품을 순서대로 확인해 보세요</p>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="인기 게임"
          title="지금 많이 평가되는 게임"
          description="평가 수와 리뷰 수가 빠르게 쌓이고 있는 타이틀부터 만나보세요."
          actionLabel="인기 게임 더 보기"
          actionHref="/games?sort=popular"
        />
        <GameShelf items={popular.items} />
      </section>

      <section>
        <SectionHeading
          eyebrow="최신 등록"
          title="최근 추가된 타이틀"
          description="새롭게 들어온 작품을 빠르게 살펴보고 취향에 맞는 게임을 골라보세요."
          actionLabel="최신순으로 보기"
          actionHref="/games?sort=latest"
        />
        <GameShelf items={latest.items} />
      </section>

      <section>
        <SectionHeading
          eyebrow="평점 상위"
          title="평점이 가장 높은 작품"
          description="평균 평점과 참여 수를 함께 고려한 현재 상위권 작품입니다."
          actionLabel="랭킹 전체 보기"
          actionHref="/rankings"
        />
        <GameShelf items={rankings.items} />
      </section>
    </main>
  );
}
