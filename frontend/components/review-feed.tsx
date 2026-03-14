import { Avatar } from "@/components/avatar";
import type { ReviewSummary } from "@/lib/types";

interface ReviewFeedProps {
  reviews: ReviewSummary[];
  highlightReviewId?: number;
}

export function ReviewFeed({ reviews, highlightReviewId }: ReviewFeedProps) {
  if (reviews.length === 0) {
    return (
      <div className="panel rounded-[28px] p-6 text-sm leading-7 text-muted">
        아직 등록된 리뷰가 없어요. 이 게임의 첫 인상을 남겨서 페이지 분위기를 만들어 보세요.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {reviews.map((review) => {
        const highlighted = review.id === highlightReviewId;

        return (
          <article
            key={review.id}
            className={`panel rounded-[28px] p-6 ${highlighted ? "border-accent bg-[rgba(245,224,209,0.45)]" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar
                  name={review.user.display_name}
                  size="md"
                  className="bg-accent-soft text-accent"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{review.user.display_name}</p>
                    {highlighted ? (
                      <span className="rounded-full bg-accent px-2 py-1 text-[11px] font-semibold text-white">내 리뷰</span>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted">@{review.user.username}</p>
                </div>
              </div>
              <p className="text-xs text-muted">
                {new Intl.DateTimeFormat("ko-KR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }).format(new Date(review.updated_at))}
              </p>
            </div>
            <p className="mt-4 text-sm leading-7 text-foreground">{review.content}</p>
          </article>
        );
      })}
    </div>
  );
}
