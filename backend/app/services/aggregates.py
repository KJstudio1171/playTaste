from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.game import Game
from app.models.rating import Rating
from app.models.review import Review


def refresh_game_aggregates(db: Session, game: Game) -> None:
    avg_rating, rating_count = db.execute(
        select(func.avg(Rating.score), func.count(Rating.id)).where(Rating.game_id == game.id)
    ).one()
    review_count = db.scalar(select(func.count(Review.id)).where(Review.game_id == game.id)) or 0

    game.avg_rating = round(float(avg_rating or 0.0), 2)
    game.rating_count = int(rating_count or 0)
    game.review_count = int(review_count or 0)

    # TODO: emit user taste activity events here when the recommendation pipeline is introduced.
