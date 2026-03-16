import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  baseUrl: string;
  params?: Record<string, string>;  // q, sort 등 기존 쿼리 파라미터 보존
}

function buildPageUrl(
  baseUrl: string,
  page: number,
  params?: Record<string, string>
): string {
  const query = new URLSearchParams({ ...params, page: String(page) });
  return `${baseUrl}?${query.toString()}`;
}

export function Pagination({ page, totalPages, baseUrl, params }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  // 표시할 페이지 번호 계산 (현재 페이지 기준 ±2, 항상 1과 마지막 포함)
  const pageNumbers: (number | "...")[] = [];
  const range = new Set([1, totalPages, page - 1, page, page + 1].filter(n => n >= 1 && n <= totalPages));
  const sorted = [...range].sort((a, b) => a - b);
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) pageNumbers.push("...");
    pageNumbers.push(n);
  });

  return (
    <nav className="flex items-center gap-1" aria-label="페이지 네비게이션">
      {prev ? (
        <Button asChild variant="secondary" size="icon-sm" aria-label="이전 페이지">
          <Link href={buildPageUrl(baseUrl, prev, params)}>←</Link>
        </Button>
      ) : (
        <span className={cn(buttonVariants({ variant: "secondary", size: "icon-sm" }), "cursor-not-allowed opacity-50")}>←</span>
      )}

      {pageNumbers.map((n, i) =>
        n === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-subtle">…</span>
        ) : (
          <Button
            key={n}
            asChild
            variant={n === page ? "default" : "secondary"}
            size="icon-sm"
            className="rounded-lg"
            aria-current={n === page ? "page" : undefined}
          >
            <Link href={buildPageUrl(baseUrl, n, params)}>{n}</Link>
          </Button>
        )
      )}

      {next ? (
        <Button asChild variant="secondary" size="icon-sm" aria-label="다음 페이지">
          <Link href={buildPageUrl(baseUrl, next, params)}>→</Link>
        </Button>
      ) : (
        <span className={cn(buttonVariants({ variant: "secondary", size: "icon-sm" }), "cursor-not-allowed opacity-50")}>→</span>
      )}
    </nav>
  );
}
