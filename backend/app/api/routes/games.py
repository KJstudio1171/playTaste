from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.game import Game
from app.models.game_genre import GameGenre
from app.models.game_platform import GamePlatform
from app.models.rating import Rating
from app.models.review import Review
from app.models.user import User
from app.schemas.api import (
    DeleteReviewResponse,
    GameCard,
    GameDetail,
    PaginatedResponse,
    RatingMutationResponse,
    RatingUpsert,
    ReviewMutationResponse,
    ReviewPayload,
)
from app.services.aggregates import refresh_game_aggregates
from app.services.pagination import paginate
from app.services.serializers import serialize_game_card, serialize_game_detail, serialize_review


router = APIRouter()

GAME_LOAD_OPTIONS = (
    selectinload(Game.genre_links).selectinload(GameGenre.genre),
    selectinload(Game.platform_links).selectinload(GamePlatform.platform),
)
DETAIL_LOAD_OPTIONS = GAME_LOAD_OPTIONS + (selectinload(Game.reviews).selectinload(Review.user),)


def build_base_game_query():
    return select(Game).options(*GAME_LOAD_OPTIONS)


def get_game_or_404(db: Session, game_id: int, with_reviews: bool = False) -> Game:
    load_options = DETAIL_LOAD_OPTIONS if with_reviews else GAME_LOAD_OPTIONS
    game = db.scalar(select(Game).options(*load_options).where(Game.id == game_id))
    if game is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found.")
    return game


def latest_sort_query():
    return build_base_game_query().order_by(
        Game.release_date.is_(None).asc(),
        Game.release_date.desc(),
        Game.created_at.desc(),
    )


def popular_sort_query():
    return build_base_game_query().order_by(
        Game.rating_count.desc(),
        Game.review_count.desc(),
        Game.avg_rating.desc(),
        Game.title.asc(),
    )


def rating_sort_query():
    return build_base_game_query().where(Game.rating_count > 0).order_by(
        Game.avg_rating.desc(),
        Game.rating_count.desc(),
        Game.review_count.desc(),
        Game.title.asc(),
    )


@router.get("", response_model=PaginatedResponse[GameCard])
def list_games(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=50),
    sort: str = Query(default="latest"),
    db: Session = Depends(get_db),
) -> PaginatedResponse[GameCard]:
    sort_map = {
        "latest": latest_sort_query,
        "popular": popular_sort_query,
        "rating": rating_sort_query,
    }
    if sort not in sort_map:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid sort option.")

    games, total = paginate(db, sort_map[sort](), page, page_size)
    return PaginatedResponse[GameCard](
        items=[serialize_game_card(game) for game in games],
        page=page,
        page_size=page_size,
        total=total,
    )


@router.get("/search", response_model=PaginatedResponse[GameCard])
def search_games(
    q: str = Query(min_length=1),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=50),
    db: Session = Depends(get_db),
) -> PaginatedResponse[GameCard]:
    statement = (
        build_base_game_query()
        .where(
            or_(
                Game.title.ilike(f"%{q}%"),
                Game.developer.ilike(f"%{q}%"),
                Game.publisher.ilike(f"%{q}%"),
            )
        )
        .order_by(Game.rating_count.desc(), Game.avg_rating.desc(), Game.title.asc())
    )
    games, total = paginate(db, statement, page, page_size)
    return PaginatedResponse[GameCard](
        items=[serialize_game_card(game) for game in games],
        page=page,
        page_size=page_size,
        total=total,
    )


@router.get("/rankings", response_model=PaginatedResponse[GameCard])
def ranking_games(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=50),
    db: Session = Depends(get_db),
) -> PaginatedResponse[GameCard]:
    games, total = paginate(db, rating_sort_query(), page, page_size)
    return PaginatedResponse[GameCard](
        items=[serialize_game_card(game) for game in games],
        page=page,
        page_size=page_size,
        total=total,
    )


@router.get("/popular", response_model=PaginatedResponse[GameCard])
def popular_games(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
) -> PaginatedResponse[GameCard]:
    games, total = paginate(db, popular_sort_query(), page, page_size)
    return PaginatedResponse[GameCard](
        items=[serialize_game_card(game) for game in games],
        page=page,
        page_size=page_size,
        total=total,
    )


@router.get("/latest", response_model=PaginatedResponse[GameCard])
def latest_games(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
) -> PaginatedResponse[GameCard]:
    games, total = paginate(db, latest_sort_query(), page, page_size)
    return PaginatedResponse[GameCard](
        items=[serialize_game_card(game) for game in games],
        page=page,
        page_size=page_size,
        total=total,
    )


@router.get("/{game_id}", response_model=GameDetail)
def read_game_detail(
    game_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> GameDetail:
    game = get_game_or_404(db, game_id, with_reviews=True)
    ordered_reviews = sorted(game.reviews, key=lambda item: item.updated_at, reverse=True)
    game.reviews = ordered_reviews[:8]

    my_rating = db.scalar(
        select(Rating.score).where(Rating.game_id == game_id, Rating.user_id == current_user.id)
    )
    my_review = db.scalar(
        select(Review)
        .options(selectinload(Review.user))
        .where(Review.game_id == game_id, Review.user_id == current_user.id)
    )

    return serialize_game_detail(game, my_rating, my_review, reviews=ordered_reviews[:8])


@router.put("/{game_id}/rating", response_model=RatingMutationResponse)
def upsert_rating(
    game_id: int,
    payload: RatingUpsert,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RatingMutationResponse:
    game = get_game_or_404(db, game_id)
    rating = db.scalar(select(Rating).where(Rating.game_id == game_id, Rating.user_id == current_user.id))
    if rating is None:
        rating = Rating(game_id=game_id, user_id=current_user.id, score=payload.score)
        db.add(rating)
    else:
        rating.score = payload.score

    db.flush()
    refresh_game_aggregates(db, game)
    db.commit()
    db.refresh(game)
    db.refresh(rating)

    return RatingMutationResponse(
        game_id=game.id,
        score=rating.score,
        avg_rating=round(float(game.avg_rating or 0.0), 2),
        rating_count=game.rating_count,
    )


@router.post("/{game_id}/review", response_model=ReviewMutationResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    game_id: int,
    payload: ReviewPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ReviewMutationResponse:
    game = get_game_or_404(db, game_id)
    existing = db.scalar(select(Review).where(Review.game_id == game_id, Review.user_id == current_user.id))
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Review already exists.")

    review = Review(game_id=game_id, user_id=current_user.id, content=payload.content)
    db.add(review)
    db.flush()
    refresh_game_aggregates(db, game)
    db.commit()
    db.refresh(game)
    review = db.scalar(select(Review).options(selectinload(Review.user)).where(Review.id == review.id))

    return ReviewMutationResponse(review=serialize_review(review), review_count=game.review_count)


@router.put("/{game_id}/review", response_model=ReviewMutationResponse)
def update_review(
    game_id: int,
    payload: ReviewPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ReviewMutationResponse:
    game = get_game_or_404(db, game_id)
    review = db.scalar(
        select(Review)
        .options(selectinload(Review.user))
        .where(Review.game_id == game_id, Review.user_id == current_user.id)
    )
    if review is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found.")

    review.content = payload.content
    db.flush()
    refresh_game_aggregates(db, game)
    db.commit()
    db.refresh(game)
    db.refresh(review)

    return ReviewMutationResponse(review=serialize_review(review), review_count=game.review_count)


@router.delete("/{game_id}/review", response_model=DeleteReviewResponse)
def delete_review(
    game_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DeleteReviewResponse:
    game = get_game_or_404(db, game_id)
    review = db.scalar(select(Review).where(Review.game_id == game_id, Review.user_id == current_user.id))
    if review is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found.")

    db.delete(review)
    db.flush()
    refresh_game_aggregates(db, game)
    db.commit()
    db.refresh(game)

    return DeleteReviewResponse(game_id=game_id, review_count=game.review_count)
