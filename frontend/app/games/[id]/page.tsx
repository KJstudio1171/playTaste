import Image from "next/image";
import { notFound } from "next/navigation";

import { RatingStars } from "@/components/rating-stars";
import { RatingWidget } from "@/components/rating-widget";
import { ReviewEditor } from "@/components/review-editor";
import { ReviewFeed } from "@/components/review-feed";
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
    <main className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="panel relative aspect-[3/4] overflow-hidden rounded-[32px]">
          <Image
            src={game.cover_image_url ?? "https://placehold.co/600x900/1f2937/f8fafc?text=Game"}
            alt={game.title}
            fill
            sizes="(max-width: 1280px) 100vw, 40vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <div className="panel rounded-[32px] p-8">
            <p className="eyebrow">game detail</p>
            <h1 className="display-title mt-3 text-5xl font-semibold">{game.title}</h1>
            <p className="mt-4 text-sm leading-7 text-muted">{game.description}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Developer</p>
                <p className="mt-2 text-sm">{game.developer ?? "Unknown"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Publisher</p>
                <p className="mt-2 text-sm">{game.publisher ?? "Unknown"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Release</p>
                <p className="mt-2 text-sm">{formatDate(game.release_date)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Genres</p>
                <p className="mt-2 text-sm">{game.genres.map((genre) => genre.name).join(", ")}</p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-6 rounded-[28px] bg-white/80 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Average</p>
                <p className="mt-1 text-3xl font-semibold">{formatRating(game.avg_rating)}</p>
              </div>
              <div>
                <RatingStars value={Math.round(game.avg_rating)} size="md" />
              </div>
              <div className="text-sm text-muted">
                <p>{game.rating_count} ratings</p>
                <p className="mt-1">{game.review_count} reviews</p>
              </div>
            </div>
          </div>

          <RatingWidget key={`${game.id}-${game.my_rating ?? 0}`} gameId={game.id} initialRating={game.my_rating} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <ReviewEditor
          key={`${game.id}-${game.my_review?.id ?? "new"}`}
          gameId={game.id}
          initialReview={game.my_review}
        />
        <div>
          <p className="eyebrow">latest reviews</p>
          <h2 className="display-title mt-3 text-3xl font-semibold">리뷰 중심 레이아웃</h2>
          <p className="mb-5 mt-2 text-sm leading-7 text-muted">
            최신 리뷰와 내 리뷰를 나란히 보면서 바로 수정하거나 추가할 수 있습니다.
          </p>
          <ReviewFeed reviews={game.latest_reviews} />
        </div>
      </section>
    </main>
  );
}
