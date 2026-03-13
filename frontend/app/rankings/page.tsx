import Image from "next/image";
import Link from "next/link";

import { fetchBackendJson } from "@/lib/api";
import { formatDate, formatRating } from "@/lib/format";
import type { GameCard, PaginatedResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function RankingsPage() {
  const rankings = await fetchBackendJson<PaginatedResponse<GameCard>>("/rankings?type=rating&page_size=20");

  return (
    <main className="space-y-6">
      <section className="panel rounded-[32px] p-8">
        <p className="eyebrow">평점 랭킹</p>
        <h1 className="display-title mt-3 text-4xl font-semibold sm:text-5xl">평점 기준 게임 랭킹</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
          평균 평점과 참여 수를 함께 고려해 현재 가장 좋은 반응을 얻는 작품을 보여줘요.
        </p>
      </section>

      <div className="grid gap-4">
        {rankings.items.map((game, index) => {
          const isTopTier = index < 3;

          return (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className={`${isTopTier ? "panel-featured" : "panel"} rounded-[28px] p-4 transition hover:-translate-y-0.5`}
            >
              <div className="flex gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold ${
                    isTopTier ? "bg-accent text-white" : "bg-surface-muted text-accent-strong"
                  }`}
                >
                  {index + 1}
                </div>

                <div className="relative h-24 w-[72px] shrink-0 overflow-hidden rounded-[20px] bg-surface-muted">
                  <Image
                    src={game.cover_image_url ?? "https://placehold.co/600x900/1f2937/f8fafc?text=Game"}
                    alt={game.title}
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{game.title}</h2>
                    <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-strong">
                      {formatRating(game.avg_rating)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {game.developer ?? "개발사 정보 없음"} · {formatDate(game.release_date)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                    {game.genres.slice(0, 2).map((genre) => (
                      <span key={genre.id} className="chip bg-accent-soft text-accent-strong">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted sm:hidden">
                    <span>평가 {game.rating_count}개</span>
                    <span>리뷰 {game.review_count}개</span>
                  </div>
                </div>

                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-2xl font-semibold text-foreground">{formatRating(game.avg_rating)}</p>
                  <p className="mt-2 text-sm text-muted">평가 {game.rating_count}개</p>
                  <p className="mt-1 text-sm text-muted">리뷰 {game.review_count}개</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
