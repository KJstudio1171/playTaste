export function formatDate(value: string | null) {
  if (!value) {
    return "출시일 미정";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function formatRating(value: number) {
  return value.toFixed(1);
}

export function formatCompactCount(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}
