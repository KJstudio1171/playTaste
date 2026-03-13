import Image from "next/image";
import Link from "next/link";

import { formatDate, formatRating } from "@/lib/format";
import type { GameCard as GameCardType } from "@/lib/types";

interface GameCardProps {
  game: GameCardType;
  variant?: "default" | "compact";
}

export function GameCard({ game, variant = "default" }: GameCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/games/${game.id}`}
        className="group panel flex h-full items-center gap-4 rounded-[26px] p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(69,42,24,0.09)]"
      >
        <div className="relative h-24 w-[72px] shrink-0 overflow-hidden rounded-[20px] bg-surface-muted">
          <Image
            src={game.cover_image_url ?? "https://placehold.co/600x900/1f2937/f8fafc?text=Game"}
            alt={game.title}
            fill
            sizes="72px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">{game.title}</h3>
            <span className="rounded-full bg-accent-soft px-2 py-1 text-xs font-semibold text-accent-strong">
              {formatRating(game.avg_rating)}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            {game.developer ?? "개발사 정보 없음"} · {formatDate(game.release_date)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
            <span>{game.rating_count}개 평가</span>
            <span>·</span>
            <span>{game.review_count}개 리뷰</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/games/${game.id}`}
      className="group panel flex h-full flex-col overflow-hidden rounded-[28px] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(69,42,24,0.09)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-muted">
        <Image
          src={game.cover_image_url ?? "https://placehold.co/600x900/1f2937/f8fafc?text=Game"}
          alt={game.title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full bg-[rgba(33,24,19,0.82)] px-3 py-1 text-xs font-semibold text-white">
          {formatRating(game.avg_rating)}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{game.title}</h3>
          <p className="mt-1 text-sm text-muted">
            {game.developer ?? "개발사 정보 없음"} · {formatDate(game.release_date)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-medium text-muted">
          {game.genres.slice(0, 2).map((genre) => (
            <span key={genre.id} className="rounded-full bg-accent-soft px-2.5 py-1 text-accent-strong">
              {genre.name}
            </span>
          ))}
          {game.platforms.slice(0, 2).map((platform) => (
            <span key={platform.id} className="rounded-full border border-line px-2.5 py-1">
              {platform.name}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between text-sm text-muted">
          <span>{game.rating_count}개 평가</span>
          <span>{game.review_count}개 리뷰</span>
        </div>
      </div>
    </Link>
  );
}
