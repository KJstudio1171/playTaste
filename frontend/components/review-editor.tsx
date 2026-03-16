"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PencilLine, Trash2 } from "lucide-react";

import type { ReviewSummary } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ReviewEditorProps {
  gameId: number;
  initialReview: ReviewSummary | null;
}

interface FeedbackState {
  tone: "success" | "error";
  text: string;
}

export function ReviewEditor({ gameId, initialReview }: ReviewEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState(() => initialReview?.content ?? "");
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState(() => !initialReview);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  async function saveReview() {
    const url = initialReview ? `/api/reviews/${initialReview.id}` : `/api/games/${gameId}/reviews`;
    const method = initialReview ? "PUT" : "POST";

    setPending(true);
    setFeedback(null);

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: draft }),
    });

    if (!response.ok) {
      const detail = await response.text();
      setPending(false);
      setFeedback({
        tone: "error",
        text: detail || "리뷰를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
      });
      return;
    }

    setPending(false);
    setEditing(false);
    setFeedback({
      tone: "success",
      text: initialReview ? "리뷰를 수정했어요." : "리뷰를 남겼어요.",
    });
    router.refresh();
  }

  async function deleteReview() {
    if (!initialReview || !window.confirm("이 리뷰를 삭제할까요?")) {
      return;
    }

    setPending(true);
    setFeedback(null);

    const response = await fetch(`/api/reviews/${initialReview.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setPending(false);
      setFeedback({
        tone: "error",
        text: "리뷰를 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.",
      });
      return;
    }

    setPending(false);
    setDraft("");
    setEditing(true);
    setFeedback({
      tone: "success",
      text: "리뷰를 삭제했어요.",
    });
    router.refresh();
  }

  const canSave = draft.trim().length >= 5 && !pending;
  const updatedLabel = initialReview
    ? new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(initialReview.updated_at))
    : null;

  return (
    <Card className="rounded-[30px] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">내 리뷰</p>
          <h3 className="mt-2 text-2xl font-semibold">
            {initialReview ? "내 리뷰" : "이 게임에 대한 생각을 남겨보세요"}
          </h3>
        </div>

        {initialReview && !editing ? (
          <div className="flex gap-2">
            <Button type="button" onClick={() => setEditing(true)} variant="secondary" size="sm">
              <PencilLine />
              수정하기
            </Button>
            <Button
              type="button"
              onClick={deleteReview}
              disabled={pending}
              variant="destructive"
              size="sm"
            >
              <Trash2 />
              삭제
            </Button>
          </div>
        ) : null}
      </div>

      {initialReview && !editing ? (
        <>
          <p className="mt-3 text-sm text-muted">마지막 수정 {updatedLabel}</p>
          <div className="mt-4 rounded-[24px] border border-line bg-surface-muted/60 p-5">
            <p className="text-sm leading-7 text-foreground">{initialReview.content}</p>
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm leading-6 text-muted">
            플레이 경험, 좋았던 점, 아쉬웠던 점을 간단히 적어 보세요.
          </p>
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="예: 전투 템포는 정말 좋았지만 후반부 반복감이 조금 아쉬웠어요."
            className="mt-4 min-h-44"
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">최소 5자 이상 입력하면 저장할 수 있어요.</p>
            <div className="flex gap-2">
              {initialReview ? (
                <Button
                  type="button"
                  onClick={() => {
                    setDraft(initialReview.content);
                    setEditing(false);
                    setFeedback(null);
                  }}
                  disabled={pending}
                  variant="secondary"
                  size="sm"
                >
                  취소
                </Button>
              ) : null}
              <Button type="button" onClick={saveReview} disabled={!canSave}>
                {pending ? "저장 중..." : initialReview ? "리뷰 저장" : "리뷰 등록"}
              </Button>
            </div>
          </div>
        </>
      )}

      {feedback ? (
        <Alert variant={feedback.tone === "success" ? "success" : "destructive"} className="mt-4">
          <AlertDescription>{feedback.text}</AlertDescription>
        </Alert>
      ) : null}
    </Card>
  );
}
