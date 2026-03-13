import Image from "next/image";
import Link from "next/link";

import { GameCard } from "@/components/game-card";
import { SectionHeading } from "@/components/section-heading";
import { fetchBackendJson } from "@/lib/api";
import { formatDate, formatRating } from "@/lib/format";
import type { GameCard as GameCardType, PaginatedResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [popular, latest, rankings] = await Promise.all([
    fetchBackendJson<PaginatedResponse<GameCardType>>("/games/popular?page_size=8"),
    fetchBackendJson<PaginatedResponse<GameCardType>>("/games/latest?page_size=8"),
    fetchBackendJson<PaginatedResponse<GameCardType>>("/rankings?type=rating&page_size=8"),
  ]);

  const featuredGame = popular.items[0];
  const sideGames = popular.items.slice(1, 4);

  return (
    <main className="space-y-10">
      {/* 이번 주 추천 */}
      <section>
        <SectionHeading
          eyebrow="이번 주 추천"
          title="지금 주목받는 게임"
          actionLabel="전체 보기"
          actionHref="/games?sort=popular"
        />
        <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
          {/* Featured 카드 */}
          {featuredGame && (
            <Link
              href={`/games/${featuredGame.id}`}
              className="group overflow-hidden rounded-xl border border-line bg-background transition hover:shadow-[var(--shadow-soft)]"
            >
              <div className="relative h-[200px] w-full overflow-hidden bg-surface-muted">
                <Image
                  src={featuredGame.cover_image_url ?? "https://placehold.co/1200x400/1f2937/f8fafc?text=Game"}
                  alt={featuredGame.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 rounded-[4px] bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                  Editor&apos;s Pick
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-extrabold tracking-[-0.03em] text-foreground">{featuredGame.title}</h2>
                <p className="mt-0.5 text-xs text-muted">
                  {featuredGame.developer ?? "개발사 정보 없음"} · {formatDate(featuredGame.release_date)}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-2xl font-black tracking-[-0.04em] text-accent">
                    {formatRating(featuredGame.avg_rating)}
                  </span>
                  <div className="flex-1">
                    <div className="h-1 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${(featuredGame.avg_rating / 5) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-subtle">리뷰 {featuredGame.review_count}개</p>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* 소형 사이드 카드 */}
          <div className="flex flex-col gap-2">
            {sideGames.map((game) => (
              <GameCard key={game.id} game={game} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      {/* 최신 게임 */}
      <section>
        <SectionHeading
          eyebrow="최신 게임"
          title="새로 출시된 게임들"
          actionLabel="전체 보기"
          actionHref="/games?sort=latest"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {latest.items.slice(0, 5).map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* 역대 최고 평점 */}
      <section>
        <SectionHeading
          eyebrow="역대 최고 평점"
          title="플레이어들이 사랑한 명작"
          actionLabel="랭킹 보기"
          actionHref="/rankings"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {rankings.items.slice(0, 5).map((game, index) => (
            <div key={game.id} className="relative">
              {index < 3 && (
                <div className="absolute left-2 top-2 z-10 rounded-[4px] bg-foreground px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                  #{index + 1}
                </div>
              )}
              <div className={index === 0 ? "rounded-[10px] ring-2 ring-accent ring-offset-2" : ""}>
                <GameCard game={game} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
