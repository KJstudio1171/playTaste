import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/badge";
import { fetchBackendJson } from "@/lib/api";
import { formatDate, formatRating } from "@/lib/format";
import type { GameCard, PaginatedResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function RankingsPage() {
  const rankings = await fetchBackendJson<PaginatedResponse<GameCard>>("/rankings?type=rating&page_size=20");

  return (
    <main className="space-y-6">
      <div>
        <p className="eyebrow">평점 랭킹</p>
        <h1 className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">평점 기준 게임 랭킹</h1>
        <p className="mt-2 text-sm text-muted">
          평균 평점과 참여 수를 함께 고려해 현재 가장 좋은 반응을 얻는 작품입니다.
        </p>
      </div>

      <div className="divide-y divide-line overflow-hidden rounded-xl border border-line">
        {rankings.items.map((game, index) => {
          const isTop3 = index < 3;
          const fillPercent = (game.avg_rating / 5) * 100;

          return (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className={`flex items-center gap-4 p-4 transition hover:bg-surface ${
                isTop3 ? "border-l-[3px] border-l-accent bg-accent-soft hover:bg-accent-soft" : "border-l-[3px] border-l-transparent"
              }`}
            >
              {/* 순번 */}
              <div
                className={`w-7 shrink-0 text-center text-sm font-extrabold ${
                  isTop3 ? "text-accent" : "text-muted"
                }`}
              >
                {index + 1}
              </div>

              {/* 커버 */}
              <div className="relative h-[58px] w-[44px] shrink-0 overflow-hidden rounded-md bg-surface-muted">
                <Image
                  src={game.cover_image_url ?? "https://placehold.co/600x900/1f2937/f8fafc?text=Game"}
                  alt={game.title}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>

              {/* 제목/메타 */}
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-bold text-foreground">{game.title}</h2>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {game.developer ?? "개발사 정보 없음"} · {formatDate(game.release_date)}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {game.genres.slice(0, 2).map((genre) => (
                    <Badge key={genre.id} variant="accent">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 평점 바 + 숫자 */}
              <div className="hidden shrink-0 items-center gap-3 sm:flex">
                <div className="w-[120px]">
                  <div className="h-1 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-accent transition-all"
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-xs text-muted">평가 {game.rating_count}개</p>
                </div>
                <span className="w-10 text-right text-base font-extrabold text-accent">
                  {formatRating(game.avg_rating)}
                </span>
              </div>

              {/* 모바일: 숫자만 */}
              <div className="shrink-0 sm:hidden">
                <span className="text-sm font-extrabold text-accent">{formatRating(game.avg_rating)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
