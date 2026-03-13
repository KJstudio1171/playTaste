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
      title="랭킹을 불러오지 못했어요"
      description="평점 랭킹을 가져오는 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요."
      onRetry={reset}
    />
  );
}
