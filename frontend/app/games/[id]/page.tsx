import Image from "next/image";
import { notFound } from "next/navigation";

import { Badge } from "@/components/badge";
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
    <main>
      {/* 게임 정보 + 사이드바 */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)]">
        {/* 좌측: 커버 + 메타 정보 */}
        <div className="space-y-6">
          {/* 커버 + 제목 그리드 */}
          <div className="flex gap-5">
            <div className="relative h-[180px] w-[130px] shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:h-[220px] sm:w-[160px]">
              <Image
                src={game.cover_image_url ?? "https://placehold.co/600x900/1f2937/f8fafc?text=Game"}
                alt={game.title}
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="eyebrow">게임 상세</p>
              <h1 className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">{game.title}</h1>
              <p className="mt-3 text-sm leading-6 text-muted">{game.description}</p>
            </div>
          </div>

          {/* 스탯 타일 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="stat-tile rounded-lg p-3 text-center">
              <p className="eyebrow">평균 평점</p>
              <p className="mt-1.5 text-2xl font-black text-accent">{formatRating(game.avg_rating)}</p>
              <div className="mt-1 flex justify-center">
                <RatingStars value={Math.round(game.avg_rating)} size="sm" />
              </div>
            </div>
            <div className="stat-tile rounded-lg p-3 text-center">
              <p className="eyebrow">평가 수</p>
              <p className="mt-1.5 text-2xl font-black text-foreground">{game.rating_count}</p>
              <p className="mt-1 text-xs text-muted">명 참여</p>
            </div>
            <div className="stat-tile rounded-lg p-3 text-center">
              <p className="eyebrow">리뷰 수</p>
              <p className="mt-1.5 text-2xl font-black text-foreground">{game.review_count}</p>
              <p className="mt-1 text-xs text-muted">개 작성</p>
            </div>
          </div>

          {/* 메타 정보 */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Meta label="개발사" value={game.developer ?? "정보 없음"} />
            <Meta label="퍼블리셔" value={game.publisher ?? "정보 없음"} />
            <Meta label="출시일" value={formatDate(game.release_date)} />
            <Meta label="플랫폼" value={game.platforms.length > 0 ? game.platforms.map((p) => p.name).join(", ") : "정보 없음"} />
          </div>

          {/* 장르/플랫폼 태그 */}
          <div className="flex flex-wrap gap-2">
            {game.genres.map((genre) => (
              <Badge key={genre.id} variant="accent">
                {genre.name}
              </Badge>
            ))}
            {game.platforms.map((platform) => (
              <Badge key={platform.id} variant="default">
                {platform.name}
              </Badge>
            ))}
          </div>

          {/* 리뷰 피드 */}
          <div>
            <SectionHeading
              eyebrow="최신 리뷰"
              title="최신 리뷰"
            />
            <ReviewFeed reviews={game.latest_reviews} highlightReviewId={game.my_review?.id} />
          </div>
        </div>

        {/* 우측: 평점 위젯 (sticky) */}
        <div className="space-y-4 lg:sticky lg:top-[96px] lg:self-start">
          <RatingWidget
            key={`${game.id}-${game.my_rating ?? 0}`}
            gameId={game.id}
            initialRating={game.my_rating}
          />
          <ReviewEditor
            key={`${game.id}-${game.my_review?.id ?? "new"}-${game.my_review?.updated_at ?? "empty"}`}
            gameId={game.id}
            initialReview={game.my_review}
          />
        </div>
      </div>
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-muted p-3">
      <p className="eyebrow">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
