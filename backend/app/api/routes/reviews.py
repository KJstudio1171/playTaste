from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.game import Game
from app.models.review import Review
from app.models.user import User
from app.schemas.api import DeleteReviewResponse, ReviewMutationResponse, ReviewPayload
from app.services.aggregates import refresh_game_aggregates
from app.services.serializers import serialize_review


router = APIRouter()


def get_review_or_404(db: Session, review_id: int, current_user: User) -> Review:
    review = db.scalar(
        select(Review)
        .options(selectinload(Review.user))
        .where(Review.id == review_id, Review.user_id == current_user.id)
    )
    if review is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found.")
    return review


@router.put("/{review_id}", response_model=ReviewMutationResponse)
def update_review_by_id(
    review_id: int,
    payload: ReviewPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ReviewMutationResponse:
    review = get_review_or_404(db, review_id, current_user)
    game = db.get(Game, review.game_id)
    if game is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found.")

    review.content = payload.content
    db.flush()
    refresh_game_aggregates(db, game)
    db.commit()
    db.refresh(game)
    review = db.scalar(select(Review).options(selectinload(Review.user)).where(Review.id == review.id))

    return ReviewMutationResponse(review=serialize_review(review), review_count=game.review_count)


@router.delete("/{review_id}", response_model=DeleteReviewResponse)
def delete_review_by_id(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DeleteReviewResponse:
    review = get_review_or_404(db, review_id, current_user)
    game = db.get(Game, review.game_id)
    if game is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found.")

    game_id = review.game_id
    db.delete(review)
    db.flush()
    refresh_game_aggregates(db, game)
    db.commit()
    db.refresh(game)

    return DeleteReviewResponse(game_id=game_id, review_count=game.review_count)
