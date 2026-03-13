"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { RatingStars } from "@/components/rating-stars";

interface RatingWidgetProps {
  gameId: number;
  initialRating: number | null;
}

export function RatingWidget({ gameId, initialRating }: RatingWidgetProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(initialRating ?? 0);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  function handleRate(score: number) {
    const previous = selected;
    const method = initialRating === null ? "POST" : "PUT";
    setSelected(score);
    setPending(true);
    setMessage("");

    startTransition(async () => {
      const response = await fetch(`/api/games/${gameId}/rating`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score }),
      });

      if (!response.ok) {
        setSelected(previous);
        setMessage("별점 저장에 실패했어요.");
        setPending(false);
        return;
      }

      setMessage("별점을 저장했어요.");
      setPending(false);
      router.refresh();
    });
  }

  return (
    <div className="panel rounded-[28px] p-5">
      <p className="eyebrow">your rating</p>
      <h3 className="mt-2 text-xl font-semibold">지금 바로 별점을 남겨보세요</h3>
      <p className="mt-2 text-sm leading-6 text-muted">
        데모 유저 기준으로 1점부터 5점까지 즉시 저장됩니다.
      </p>
      <div className="mt-5 flex items-center justify-between gap-4">
        <RatingStars value={selected} interactive pending={pending} onChange={handleRate} size="lg" />
        <span className="rounded-full bg-[rgba(198,91,43,0.12)] px-3 py-1 text-sm font-semibold text-accent">
          {selected ? `${selected}.0 / 5` : "Not rated"}
        </span>
      </div>
      {message ? <p className="mt-4 text-sm text-muted">{message}</p> : null}
    </div>
  );
}
