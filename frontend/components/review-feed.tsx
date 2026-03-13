import type { ReviewSummary } from "@/lib/types";

interface ReviewFeedProps {
  reviews: ReviewSummary[];
}

export function ReviewFeed({ reviews }: ReviewFeedProps) {
  if (reviews.length === 0) {
    return (
      <div className="panel rounded-[28px] p-6 text-sm text-muted">
        아직 등록된 리뷰가 없습니다. 첫 리뷰를 남겨서 이 게임 페이지의 분위기를 만들어 보세요.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {reviews.map((review) => (
        <article key={review.id} className="panel rounded-[28px] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{review.user.display_name}</p>
              <p className="text-xs text-muted">@{review.user.username}</p>
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
      ))}
    </div>
  );
}
