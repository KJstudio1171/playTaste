"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import type { ReviewSummary } from "@/lib/types";

interface ReviewEditorProps {
  gameId: number;
  initialReview: ReviewSummary | null;
}

export function ReviewEditor({ gameId, initialReview }: ReviewEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState(initialReview?.content ?? "");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  function saveReview() {
    const url = initialReview ? `/api/reviews/${initialReview.id}` : `/api/games/${gameId}/reviews`;
    const method = initialReview ? "PUT" : "POST";
    setPending(true);
    setMessage("");

    startTransition(async () => {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: draft }),
      });

      if (!response.ok) {
        const detail = await response.text();
        setMessage(detail || "리뷰 저장에 실패했어요.");
        setPending(false);
        return;
      }

      setMessage(initialReview ? "리뷰를 수정했어요." : "리뷰를 등록했어요.");
      setPending(false);
      router.refresh();
    });
  }

  function deleteReview() {
    if (!initialReview || !window.confirm("리뷰를 삭제할까요?")) {
      return;
    }

    setPending(true);
    setMessage("");

    startTransition(async () => {
      const response = await fetch(`/api/reviews/${initialReview.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setMessage("리뷰 삭제에 실패했어요.");
        setPending(false);
        return;
      }

      setDraft("");
      setMessage("리뷰를 삭제했어요.");
      setPending(false);
      router.refresh();
    });
  }

  return (
    <div className="panel rounded-[28px] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">your review</p>
          <h3 className="mt-2 text-xl font-semibold">짧은 감상보다, 제대로 남기는 리뷰</h3>
        </div>
        {initialReview ? (
          <button
            type="button"
            onClick={deleteReview}
            disabled={pending}
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted transition hover:border-accent hover:text-accent disabled:opacity-60"
          >
            Delete
          </button>
        ) : null}
      </div>

      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="게임의 인상, 장단점, 추천 포인트를 남겨보세요."
        className="mt-4 min-h-40 w-full rounded-[24px] border border-line bg-white/80 px-4 py-4 text-sm leading-7 outline-none transition focus:border-accent"
      />

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">최소 5자 이상 입력하면 저장할 수 있어요.</p>
        <button
          type="button"
          onClick={saveReview}
          disabled={pending || draft.trim().length < 5}
          className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {initialReview ? "리뷰 수정" : "리뷰 등록"}
        </button>
      </div>

      {message ? <p className="mt-4 text-sm text-muted">{message}</p> : null}
    </div>
  );
}
