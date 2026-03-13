import Image from "next/image";
import Link from "next/link";

import { formatDate, formatRating } from "@/lib/format";
import type { GameCard as GameCardType } from "@/lib/types";

interface GameCardProps {
  game: GameCardType;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link
      href={`/games/${game.id}`}
      className="group panel flex h-full flex-col overflow-hidden rounded-[28px] transition duration-200 hover:-translate-y-1"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#ead8c5]">
        <Image
          src={game.cover_image_url ?? "https://placehold.co/600x900/1f2937/f8fafc?text=Game"}
          alt={game.title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-[rgba(21,14,9,0.78)] px-3 py-1 text-xs font-semibold text-white">
          {formatRating(game.avg_rating)}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{game.title}</h3>
          <p className="mt-1 text-sm text-muted">
            {game.developer ?? "Unknown studio"} · {formatDate(game.release_date)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-medium text-muted">
          {game.genres.slice(0, 2).map((genre) => (
            <span key={genre.id} className="rounded-full bg-[rgba(198,91,43,0.08)] px-2.5 py-1">
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
          <span>{game.rating_count} ratings</span>
          <span>{game.review_count} reviews</span>
        </div>
      </div>
    </Link>
  );
}
