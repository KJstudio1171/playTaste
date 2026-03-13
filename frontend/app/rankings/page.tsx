import Link from "next/link";

import { fetchBackendJson } from "@/lib/api";
import { formatDate, formatRating } from "@/lib/format";
import type { GameCard, PaginatedResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function RankingsPage() {
  const rankings = await fetchBackendJson<PaginatedResponse<GameCard>>("/games/rankings?page_size=20");

  return (
    <main className="space-y-8">
      <section className="panel rounded-[32px] p-8">
        <p className="eyebrow">ratings ranking</p>
        <h1 className="display-title mt-3 text-5xl font-semibold">평점 기반 게임 랭킹</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
          평균 평점이 높은 게임을 우선으로 하되, 참여 수가 많은 작품이 위로 오도록 정렬했습니다.
        </p>
      </section>

      <div className="grid gap-4">
        {rankings.items.map((game, index) => (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
            className="panel grid gap-4 rounded-[28px] p-6 transition hover:-translate-y-1 md:grid-cols-[72px_1fr_auto]"
          >
            <div className="display-title flex h-[72px] w-[72px] items-center justify-center rounded-[24px] bg-[rgba(198,91,43,0.12)] text-3xl font-semibold text-accent">
              {index + 1}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold">{game.title}</h2>
                <span className="rounded-full bg-[rgba(198,91,43,0.08)] px-3 py-1 text-xs font-semibold text-accent">
                  {formatRating(game.avg_rating)}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">
                {game.developer ?? "Unknown studio"} · {formatDate(game.release_date)}
              </p>
              <p className="mt-3 text-sm text-muted">
                {game.genres.map((genre) => genre.name).join(" / ")} · {game.platforms.map((platform) => platform.name).join(", ")}
              </p>
            </div>
            <div className="text-sm text-muted md:text-right">
              <p>{game.rating_count} ratings</p>
              <p className="mt-1">{game.review_count} reviews</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
