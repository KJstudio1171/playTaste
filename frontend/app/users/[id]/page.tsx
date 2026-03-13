import { notFound } from "next/navigation";

import { GameCard } from "@/components/game-card";
import { fetchBackendResponse } from "@/lib/api";
import { formatDate, formatRating } from "@/lib/format";
import type { UserProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

interface UserProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params;
  const response = await fetchBackendResponse(`/users/${id}`);

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to load profile.");
  }

  const profile = (await response.json()) as UserProfile;

  return (
    <main className="space-y-8">
      <section className="panel rounded-[32px] p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-accent-soft text-3xl font-semibold text-accent">
              {profile.display_name.slice(0, 1)}
            </div>
            <div>
              <p className="eyebrow">profile</p>
              <h1 className="display-title mt-2 text-5xl font-semibold">{profile.display_name}</h1>
              <p className="mt-2 text-sm text-muted">@{profile.username}</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{profile.bio ?? "소개가 아직 없습니다."}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] bg-white/80 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Ratings</p>
              <p className="mt-2 text-3xl font-semibold">{profile.stats.rating_count}</p>
            </div>
            <div className="rounded-[24px] bg-white/80 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Reviews</p>
              <p className="mt-2 text-3xl font-semibold">{profile.stats.review_count}</p>
            </div>
            <div className="rounded-[24px] bg-white/80 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Avg Given</p>
              <p className="mt-2 text-3xl font-semibold">
                {profile.stats.average_rating_given ? formatRating(profile.stats.average_rating_given) : "-"}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted">
          Joined {formatDate(profile.created_at)}
        </p>
      </section>

      <section>
        <div className="mb-5">
          <p className="eyebrow">recent ratings</p>
          <h2 className="display-title mt-2 text-3xl font-semibold">최근 별점을 준 게임</h2>
        </div>
        {profile.recent_ratings.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {profile.recent_ratings.map((entry) => (
              <div key={`${entry.game.id}-${entry.updated_at}`} className="space-y-3">
                <GameCard game={entry.game} />
                <div className="rounded-[22px] bg-white/80 px-4 py-3 text-sm text-muted">
                  내 별점 <span className="font-semibold text-foreground">{entry.score}.0 / 5</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="panel rounded-[28px] p-6 text-sm text-muted">아직 남긴 별점이 없습니다.</div>
        )}
      </section>

      <section>
        <div className="mb-5">
          <p className="eyebrow">recent reviews</p>
          <h2 className="display-title mt-2 text-3xl font-semibold">최근 리뷰</h2>
        </div>
        {profile.recent_reviews.length > 0 ? (
          <div className="grid gap-4">
            {profile.recent_reviews.map((review) => (
              <article key={review.id} className="panel rounded-[28px] p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{review.game.title}</h3>
                    <p className="mt-1 text-sm text-muted">{formatDate(review.updated_at)}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-foreground">{review.content}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="panel rounded-[28px] p-6 text-sm text-muted">아직 남긴 리뷰가 없습니다.</div>
        )}
      </section>
    </main>
  );
}
