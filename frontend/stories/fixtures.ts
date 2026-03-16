import type { GameCard, ReviewSummary } from "@/lib/types";

export const sampleGame: GameCard = {
  id: 101,
  title: "Metaphor: ReFantazio",
  slug: "metaphor-refantazio",
  cover_image_url: "https://placehold.co/600x900/eef2ff/4f46e5?text=Metaphor",
  release_date: "2024-10-11",
  avg_rating: 4.7,
  rating_count: 1482,
  review_count: 327,
  developer: "Studio Zero",
  publisher: "SEGA",
  genres: [
    { id: 1, name: "RPG", slug: "rpg" },
    { id: 2, name: "JRPG", slug: "jrpg" },
  ],
  platforms: [
    { id: 1, name: "PC", slug: "pc" },
    { id: 2, name: "PS5", slug: "ps5" },
  ],
};

export const compactGame: GameCard = {
  ...sampleGame,
  id: 102,
  title: "Balatro",
  slug: "balatro",
  cover_image_url: "https://placehold.co/600x900/f0fdf4/16a34a?text=Balatro",
  release_date: "2024-02-20",
  avg_rating: 4.5,
  rating_count: 982,
  review_count: 121,
  developer: "LocalThunk",
  publisher: "Playstack",
  genres: [{ id: 3, name: "Roguelike", slug: "roguelike" }],
  platforms: [{ id: 1, name: "PC", slug: "pc" }],
};

export const sampleReviews: ReviewSummary[] = [
  {
    id: 1,
    content: "전투 템포와 UI 피드백이 좋아서 몰입감이 높았고, 후반부 빌드 선택도 꽤 만족스러웠어요.",
    created_at: "2026-03-01T09:00:00.000Z",
    updated_at: "2026-03-03T09:00:00.000Z",
    user: {
      id: 11,
      username: "aria",
      display_name: "Aria Kim",
      avatar_url: null,
    },
  },
  {
    id: 2,
    content: "스토리 전개가 조금 느리지만 캐릭터 빌드와 전투 리듬은 정말 좋았습니다.",
    created_at: "2026-03-02T09:00:00.000Z",
    updated_at: "2026-03-04T09:00:00.000Z",
    user: {
      id: 12,
      username: "jin",
      display_name: "Jin Park",
      avatar_url: null,
    },
  },
];
