import Link from "next/link";

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

  const btnBase = "flex h-9 min-w-[36px] items-center justify-center rounded-lg border px-3 text-sm font-medium transition";
  const btnActive = "border-accent bg-accent text-white";
  const btnDefault = "border-line bg-background text-foreground hover:border-accent hover:text-accent";
  const btnDisabled = "border-line bg-surface text-subtle cursor-not-allowed";

  return (
    <nav className="flex items-center gap-1" aria-label="페이지 네비게이션">
      {prev ? (
        <Link href={buildPageUrl(baseUrl, prev, params)} className={`${btnBase} ${btnDefault}`}>
          ←
        </Link>
      ) : (
        <span className={`${btnBase} ${btnDisabled}`}>←</span>
      )}

      {pageNumbers.map((n, i) =>
        n === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-subtle">…</span>
        ) : (
          <Link
            key={n}
            href={buildPageUrl(baseUrl, n, params)}
            className={`${btnBase} ${n === page ? btnActive : btnDefault}`}
            aria-current={n === page ? "page" : undefined}
          >
            {n}
          </Link>
        )
      )}

      {next ? (
        <Link href={buildPageUrl(baseUrl, next, params)} className={`${btnBase} ${btnDefault}`}>
          →
        </Link>
      ) : (
        <span className={`${btnBase} ${btnDisabled}`}>→</span>
      )}
    </nav>
  );
}
