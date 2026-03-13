"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { RatingStars } from "@/components/rating-stars";

interface RatingWidgetProps {
  gameId: number;
  initialRating: number | null;
}

interface FeedbackState {
  tone: "success" | "error";
  text: string;
}

export function RatingWidget({ gameId, initialRating }: RatingWidgetProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(initialRating ?? 0);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  async function handleRate(score: number) {
    const previous = selected;
    const method = initialRating === null ? "POST" : "PUT";

    setSelected(score);
    setPending(true);
    setFeedback(null);

    const response = await fetch(`/api/games/${gameId}/rating`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score }),
    });

    if (!response.ok) {
      setSelected(previous);
      setPending(false);
      setFeedback({
        tone: "error",
        text: "별점을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
      });
      return;
    }

    setPending(false);
    setFeedback({
      tone: "success",
      text: initialRating === null ? "별점을 남겼어요." : "별점을 수정했어요.",
    });
    router.refresh();
  }

  return (
    <div className="panel rounded-[30px] p-5 sm:p-6">
      <p className="eyebrow">내 별점</p>
      <h3 className="mt-2 text-2xl font-semibold">이 게임, 몇 점인가요?</h3>
      <p className="mt-2 text-sm leading-6 text-muted">
        별을 누르면 바로 저장돼요. 나중에 다시 바꿔도 괜찮아요.
      </p>

      <div className="mt-5 rounded-[24px] bg-surface-muted/60 p-4">
        <RatingStars value={selected} interactive pending={pending} onChange={handleRate} size="lg" />
        <p className="mt-3 text-sm font-semibold text-foreground">
          {selected ? `내 점수 ${selected}.0 / 5` : "아직 내 별점이 없어요."}
        </p>
        <p className="mt-1 text-sm text-muted">
          {pending ? "별점을 저장하고 있어요..." : "한 번 남긴 별점도 다시 수정할 수 있어요."}
        </p>
      </div>

      {feedback ? (
        <p
          className={`mt-4 rounded-2xl px-4 py-3 text-sm font-medium ${
            feedback.tone === "success" ? "status-success" : "status-error"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}
    </div>
  );
}
