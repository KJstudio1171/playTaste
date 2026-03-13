from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.routes.games import rating_sort_query
from app.db.session import get_db
from app.schemas.api import GameCard, PaginatedResponse
from app.services.pagination import paginate
from app.services.serializers import serialize_game_card


router = APIRouter()


@router.get("/rankings", response_model=PaginatedResponse[GameCard])
def list_rankings(
    type: str = Query(default="rating"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=50),
    db: Session = Depends(get_db),
) -> PaginatedResponse[GameCard]:
    if type != "rating":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only rating rankings are supported.",
        )

    games, total = paginate(db, rating_sort_query(), page, page_size)
    return PaginatedResponse[GameCard](
        items=[serialize_game_card(game) for game in games],
        page=page,
        page_size=page_size,
        total=total,
    )
