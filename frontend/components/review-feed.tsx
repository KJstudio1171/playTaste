import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/badge";
import { Card } from "@/components/ui/card";
import type { ReviewSummary } from "@/lib/types";

interface ReviewFeedProps {
  reviews: ReviewSummary[];
  highlightReviewId?: number;
}

export function ReviewFeed({ reviews, highlightReviewId }: ReviewFeedProps) {
  if (reviews.length === 0) {
    return (
      <Card className="rounded-[28px] p-6 text-sm leading-7 text-muted">
        아직 등록된 리뷰가 없어요. 이 게임의 첫 인상을 남겨서 페이지 분위기를 만들어 보세요.
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {reviews.map((review) => {
        const highlighted = review.id === highlightReviewId;

        return (
          <Card
            key={review.id}
            className={`rounded-[28px] p-6 ${highlighted ? "border-accent-mid bg-accent-soft" : ""}`}
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
                      <Badge variant="accent">내 리뷰</Badge>
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
          </Card>
        );
      })}
    </div>
  );
}
