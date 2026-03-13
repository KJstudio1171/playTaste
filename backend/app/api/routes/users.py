from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.game import Game
from app.models.game_genre import GameGenre
from app.models.game_platform import GamePlatform
from app.models.rating import Rating
from app.models.review import Review
from app.models.user import User
from app.schemas.api import UserProfile
from app.services.serializers import serialize_user_profile


router = APIRouter()

GAME_LOAD_OPTIONS = (
    selectinload(Game.genre_links).selectinload(GameGenre.genre),
    selectinload(Game.platform_links).selectinload(GamePlatform.platform),
)


@router.get("/{user_id}", response_model=UserProfile)
def read_user_profile(user_id: int, db: Session = Depends(get_db)) -> UserProfile:
    user = db.scalar(select(User).where(User.id == user_id))
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    ratings = db.scalars(
        select(Rating)
        .options(selectinload(Rating.game).options(*GAME_LOAD_OPTIONS))
        .where(Rating.user_id == user_id)
        .order_by(Rating.updated_at.desc())
        .limit(8)
    ).all()
    reviews = db.scalars(
        select(Review)
        .options(selectinload(Review.game).options(*GAME_LOAD_OPTIONS))
        .where(Review.user_id == user_id)
        .order_by(Review.updated_at.desc())
        .limit(8)
    ).all()
    average_rating_given = db.scalar(select(func.avg(Rating.score)).where(Rating.user_id == user_id))
    total_rating_count = db.scalar(select(func.count(Rating.id)).where(Rating.user_id == user_id)) or 0
    total_review_count = db.scalar(select(func.count(Review.id)).where(Review.user_id == user_id)) or 0

    return serialize_user_profile(
        user,
        ratings,
        reviews,
        average_rating_given,
        total_rating_count=total_rating_count,
        total_review_count=total_review_count,
    )
