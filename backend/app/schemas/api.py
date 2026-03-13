from datetime import date, datetime
from typing import Generic, TypeVar

from pydantic import BaseModel, Field


T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    page: int
    page_size: int
    total: int


class GenreSummary(BaseModel):
    id: int
    name: str
    slug: str


class PlatformSummary(BaseModel):
    id: int
    name: str
    slug: str


class UserSummary(BaseModel):
    id: int
    username: str
    display_name: str
    avatar_url: str | None = None


class GameCard(BaseModel):
    id: int
    title: str
    slug: str
    cover_image_url: str | None = None
    release_date: date | None = None
    avg_rating: float
    rating_count: int
    review_count: int
    developer: str | None = None
    publisher: str | None = None
    genres: list[GenreSummary]
    platforms: list[PlatformSummary]


class ReviewSummary(BaseModel):
    id: int
    content: str
    created_at: datetime
    updated_at: datetime
    user: UserSummary


class GameDetail(GameCard):
    description: str
    latest_reviews: list[ReviewSummary]
    my_rating: int | None = None
    my_review: ReviewSummary | None = None


class RatingUpsert(BaseModel):
    score: int = Field(ge=1, le=5)


class RatingMutationResponse(BaseModel):
    game_id: int
    score: int
    avg_rating: float
    rating_count: int


class ReviewPayload(BaseModel):
    content: str = Field(min_length=5, max_length=3000)


class ReviewMutationResponse(BaseModel):
    review: ReviewSummary
    review_count: int


class UserRatingEntry(BaseModel):
    score: int
    updated_at: datetime
    game: GameCard


class UserReviewEntry(BaseModel):
    id: int
    content: str
    created_at: datetime
    updated_at: datetime
    game: GameCard


class UserProfileStats(BaseModel):
    rating_count: int
    review_count: int
    average_rating_given: float | None = None


class UserProfile(BaseModel):
    id: int
    username: str
    display_name: str
    bio: str | None = None
    avatar_url: str | None = None
    created_at: datetime
    stats: UserProfileStats
    recent_ratings: list[UserRatingEntry]
    recent_reviews: list[UserReviewEntry]


class HealthResponse(BaseModel):
    status: str


class DeleteReviewResponse(BaseModel):
    game_id: int
    review_count: int
