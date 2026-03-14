import { notFound } from "next/navigation";

import { Avatar } from "@/components/avatar";
import { GameCard } from "@/components/game-card";
import { SectionHeading } from "@/components/section-heading";
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
      <section className="panel rounded-xl p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <Avatar
              name={profile.display_name}
              size="lg"
              className="rounded-xl bg-accent-soft text-accent"
            />
            <div>
              <p className="eyebrow">프로필</p>
              <h1 className="display-title mt-2 text-4xl font-semibold sm:text-5xl">{profile.display_name}</h1>
              <p className="mt-2 text-sm text-muted">@{profile.username}</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                {profile.bio ?? "아직 소개가 등록되지 않았어요."}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="stat-tile rounded-lg px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">평가 수</p>
              <p className="mt-2 text-3xl font-semibold">{profile.stats.rating_count}</p>
            </div>
            <div className="stat-tile rounded-lg px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">리뷰 수</p>
              <p className="mt-2 text-3xl font-semibold">{profile.stats.review_count}</p>
            </div>
            <div className="stat-tile rounded-lg px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">평균 준 평점</p>
              <p className="mt-2 text-3xl font-semibold">
                {profile.stats.average_rating_given ? formatRating(profile.stats.average_rating_given) : "-"}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted">가입일 {formatDate(profile.created_at)}</p>
      </section>

      <section>
        <SectionHeading eyebrow="최근 별점" title="최근 별점을 남긴 게임" />
        {profile.recent_ratings.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {profile.recent_ratings.map((entry) => (
              <div key={`${entry.game.id}-${entry.updated_at}`} className="space-y-3">
                <GameCard game={entry.game} variant="compact" />
                <div className="rounded-lg bg-surface-muted px-4 py-2.5 text-sm text-muted">
                  내 별점 <span className="font-semibold text-foreground">{entry.score}.0 / 5</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-line p-5 text-sm text-muted">아직 남긴 별점이 없어요.</div>
        )}
      </section>

      <section>
        <SectionHeading eyebrow="최근 리뷰" title="최근 작성한 리뷰" />
        {profile.recent_reviews.length > 0 ? (
          <div className="grid gap-4">
            {profile.recent_reviews.map((review) => (
              <article key={review.id} className="panel rounded-xl p-5">
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
          <div className="rounded-lg border border-line p-5 text-sm text-muted">아직 작성한 리뷰가 없어요.</div>
        )}
      </section>
    </main>
  );
}
