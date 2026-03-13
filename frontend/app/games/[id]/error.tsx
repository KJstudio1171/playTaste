"use client";

import { PageError } from "@/components/page-error";

export default function GameDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageError
      title="게임 상세를 불러오지 못했습니다"
      description="게임 정보나 리뷰 데이터를 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요."
      onRetry={reset}
    />
  );
}
