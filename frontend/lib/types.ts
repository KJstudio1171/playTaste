export interface GenreSummary {
  id: number;
  name: string;
  slug: string;
}

export interface PlatformSummary {
  id: number;
  name: string;
  slug: string;
}

export interface UserSummary {
  id: number;
  username: string;
  display_name: string;
  avatar_url: string | null;
}

export interface GameCard {
  id: number;
  title: string;
  slug: string;
  cover_image_url: string | null;
  release_date: string | null;
  avg_rating: number;
  rating_count: number;
  review_count: number;
  developer: string | null;
  publisher: string | null;
  genres: GenreSummary[];
  platforms: PlatformSummary[];
}

export interface ReviewSummary {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user: UserSummary;
}

export interface GameDetail extends GameCard {
  description: string;
  latest_reviews: ReviewSummary[];
  my_rating: number | null;
  my_review: ReviewSummary | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}

export interface UserRatingEntry {
  score: number;
  updated_at: string;
  game: GameCard;
}

export interface UserReviewEntry {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  game: GameCard;
}

export interface UserProfile {
  id: number;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  stats: {
    rating_count: number;
    review_count: number;
    average_rating_given: number | null;
  };
  recent_ratings: UserRatingEntry[];
  recent_reviews: UserReviewEntry[];
}
