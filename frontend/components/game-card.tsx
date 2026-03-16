import Image from "next/image";
import Link from "next/link";

import { formatDate, formatRating } from "@/lib/format";
import type { GameCard as GameCardType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GameCardProps {
  game: GameCardType;
  variant?: "default" | "compact";
}

export function GameCard({ game, variant = "default" }: GameCardProps) {
  if (variant === "compact") {
    return (
      <Card
        asChild
        size="sm"
        className="rounded-[10px] border-line bg-surface py-0 transition hover:shadow-[var(--shadow-soft)]"
      >
        <Link
          href={`/games/${game.id}`}
          className="group flex h-full items-center gap-3 overflow-hidden"
        >
        <div className="relative h-[58px] w-[44px] shrink-0 bg-surface-muted">
          <Image
            src={game.cover_image_url ?? "https://placehold.co/600x900/1f2937/f8fafc?text=Game"}
            alt={game.title}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1 py-2 pr-3">
          <h3 className="truncate text-sm font-bold leading-tight text-foreground">{game.title}</h3>
          <p className="mt-0.5 truncate text-xs text-muted">
            {game.developer ?? "개발사 정보 없음"} · {formatDate(game.release_date)}
          </p>
        </div>
        <div className="shrink-0 pr-3 text-right">
          <Badge variant="accent" className="px-2 py-0.5 text-[10px] font-semibold">
            {formatRating(game.avg_rating)}
          </Badge>
        </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card
      asChild
      className="h-full rounded-[10px] border-line py-0 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
    >
      <Link
        href={`/games/${game.id}`}
        className="group flex h-full flex-col overflow-hidden"
      >
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-muted">
        <Image
          src={game.cover_image_url ?? "https://placehold.co/600x900/1f2937/f8fafc?text=Game"}
          alt={game.title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-2 right-2">
          {formatRating(game.avg_rating)}
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="accent" className="shrink-0 px-1.5 py-0 text-[10px] font-semibold">
            {formatRating(game.avg_rating)}
          </Badge>
          {game.genres[0]?.name ? (
            <Badge variant="default" className="max-w-[60%] truncate">
              {game.genres[0].name}
            </Badge>
          ) : null}
        </div>
        <h3 className="text-sm font-bold leading-snug text-foreground">{game.title}</h3>
        <p className="text-xs text-subtle">{game.genres[0]?.name ?? game.developer ?? ""}</p>
        <Progress value={(game.avg_rating / 5) * 100} className="mt-auto" />
      </CardContent>
      </Link>
    </Card>
  );
}
