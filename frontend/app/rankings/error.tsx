"use client";

import { PageError } from "@/components/page-error";

export default function RankingsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageError
      title="랭킹을 불러오지 못했습니다"
      description="평점 랭킹 데이터를 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      onRetry={reset}
    />
  );
}
