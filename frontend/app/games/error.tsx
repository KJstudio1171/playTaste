"use client";

import { PageError } from "@/components/page-error";

export default function GamesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageError
      title="게임 목록을 불러오지 못했습니다"
      description="목록 또는 검색 결과를 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      onRetry={reset}
    />
  );
}
