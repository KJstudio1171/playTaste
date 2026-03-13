import Image from "next/image";
import { notFound } from "next/navigation";

import { RatingStars } from "@/components/rating-stars";
import { RatingWidget } from "@/components/rating-widget";
import { ReviewEditor } from "@/components/review-editor";
import { ReviewFeed } from "@/components/review-feed";
import { SectionHeading } from "@/components/section-heading";
import { fetchBackendResponse } from "@/lib/api";
import { formatDate, formatRating } from "@/lib/format";
import type { GameDetail } from "@/lib/types";

export const dynamic = "force-dynamic";

interface GameDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { id } = await params;
  const response = await fetchBackendResponse(`/games/${id}`);

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to load game detail.");
  }

  const game = (await response.json()) as GameDetail;

  return (
    <main className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="panel relative aspect-[4/5] overflow-hidden rounded-[32px]">
          <Image
            src={game.cover_image_url ?? "https://placehold.co/600x900/1f2937/f8fafc?text=Game"}
            alt={game.title}
            fill
            sizes="(max-width: 1280px) 100vw, 340px"
            className="object-cover"
          />
        </div>

        <div className="panel rounded-[32px] p-6 sm:p-8">
          <p className="eyebrow">게임 상세</p>
          <h1 className="display-title mt-3 text-4xl font-semibold sm:text-5xl">{game.title}</h1>
          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">{game.description}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="stat-tile rounded-[24px] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">평균 평점</p>
              <p className="mt-2 text-3xl font-semibold">{formatRating(game.avg_rating)}</p>
              <div className="mt-2">
                <RatingStars value={Math.round(game.avg_rating)} size="sm" />
              </div>
            </div>
            <div className="stat-tile rounded-[24px] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">평가 수</p>
              <p className="mt-2 text-3xl font-semibold">{game.rating_count}</p>
              <p className="mt-2 text-sm text-muted">별점을 남긴 플레이어 수</p>
            </div>
            <div className="stat-tile rounded-[24px] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">리뷰 수</p>
              <p className="mt-2 text-3xl font-semibold">{game.review_count}</p>
              <p className="mt-2 text-sm text-muted">현재 공개된 리뷰 수</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Meta label="개발사" value={game.developer ?? "개발사 정보 없음"} />
            <Meta label="퍼블리셔" value={game.publisher ?? "퍼블리셔 정보 없음"} />
            <Meta label="출시일" value={formatDate(game.release_date)} />
            <Meta
              label="플랫폼"
              value={game.platforms.length > 0 ? game.platforms.map((platform) => platform.name).join(", ") : "정보 없음"}
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">장르</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {game.genres.map((genre) => (
                  <span key={genre.id} className="chip bg-accent-soft text-accent-strong">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">플랫폼 태그</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {game.platforms.map((platform) => (
                  <span key={platform.id} className="chip">
                    {platform.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-4 xl:sticky xl:top-28 xl:self-start">
          <RatingWidget key={`${game.id}-${game.my_rating ?? 0}`} gameId={game.id} initialRating={game.my_rating} />
          <ReviewEditor
            key={`${game.id}-${game.my_review?.id ?? "new"}-${game.my_review?.updated_at ?? "empty"}`}
            gameId={game.id}
            initialReview={game.my_review}
          />
        </div>

        <div>
          <SectionHeading
            eyebrow="최신 리뷰"
            title="최신 리뷰"
            description="이 게임을 플레이한 사람들이 무엇을 좋아했고 무엇을 아쉬워했는지 바로 읽어보세요."
          />
          <ReviewFeed reviews={game.latest_reviews} highlightReviewId={game.my_review?.id} />
        </div>
      </section>
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-surface-muted/45 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-2 text-sm leading-6 text-foreground">{value}</p>
    </div>
  );
}
