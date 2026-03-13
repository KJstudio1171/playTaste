from app.models.game import Game
from app.models.rating import Rating
from app.models.review import Review
from app.models.user import User
from app.schemas.api import (
    GameCard,
    GameDetail,
    GenreSummary,
    PlatformSummary,
    ReviewSummary,
    UserProfile,
    UserProfileStats,
    UserRatingEntry,
    UserReviewEntry,
    UserSummary,
)


def serialize_user_summary(user: User) -> UserSummary:
    return UserSummary(
        id=user.id,
        username=user.username,
        display_name=user.display_name,
        avatar_url=user.avatar_url,
    )


def serialize_genres(game: Game) -> list[GenreSummary]:
    return [
        GenreSummary(id=link.genre.id, name=link.genre.name, slug=link.genre.slug)
        for link in game.genre_links
        if link.genre is not None
    ]


def serialize_platforms(game: Game) -> list[PlatformSummary]:
    return [
        PlatformSummary(id=link.platform.id, name=link.platform.name, slug=link.platform.slug)
        for link in game.platform_links
        if link.platform is not None
    ]


def serialize_game_card(game: Game) -> GameCard:
    return GameCard(
        id=game.id,
        title=game.title,
        slug=game.slug,
        cover_image_url=game.cover_image_url,
        release_date=game.release_date,
        avg_rating=round(float(game.avg_rating or 0.0), 2),
        rating_count=game.rating_count,
        review_count=game.review_count,
        developer=game.developer,
        publisher=game.publisher,
        genres=serialize_genres(game),
        platforms=serialize_platforms(game),
    )


def serialize_review(review: Review) -> ReviewSummary:
    return ReviewSummary(
        id=review.id,
        content=review.content,
        created_at=review.created_at,
        updated_at=review.updated_at,
        user=serialize_user_summary(review.user),
    )


def serialize_game_detail(
    game: Game,
    my_rating: int | None,
    my_review: Review | None,
    reviews: list[Review] | None = None,
) -> GameDetail:
    return GameDetail(
        **serialize_game_card(game).model_dump(),
        description=game.description,
        latest_reviews=[serialize_review(review) for review in (reviews if reviews is not None else game.reviews)],
        my_rating=my_rating,
        my_review=serialize_review(my_review) if my_review is not None else None,
    )


def serialize_user_profile(
    user: User,
    ratings: list[Rating],
    reviews: list[Review],
    average_rating_given: float | None,
    total_rating_count: int | None = None,
    total_review_count: int | None = None,
) -> UserProfile:
    return UserProfile(
        id=user.id,
        username=user.username,
        display_name=user.display_name,
        bio=user.bio,
        avatar_url=user.avatar_url,
        created_at=user.created_at,
        stats=UserProfileStats(
            rating_count=total_rating_count if total_rating_count is not None else len(ratings),
            review_count=total_review_count if total_review_count is not None else len(reviews),
            average_rating_given=round(float(average_rating_given), 2) if average_rating_given is not None else None,
        ),
        recent_ratings=[
            UserRatingEntry(
                score=rating.score,
                updated_at=rating.updated_at,
                game=serialize_game_card(rating.game),
            )
            for rating in ratings
        ],
        recent_reviews=[
            UserReviewEntry(
                id=review.id,
                content=review.content,
                created_at=review.created_at,
                updated_at=review.updated_at,
                game=serialize_game_card(review.game),
            )
            for review in reviews
        ],
    )
