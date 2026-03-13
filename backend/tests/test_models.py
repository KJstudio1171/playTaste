import pytest
from sqlalchemy.exc import IntegrityError

from app.models.game import Game
from app.models.rating import Rating
from app.models.review import Review
from app.models.user import User


def test_rating_score_constraint(session_factory):
    with session_factory() as session:
        user = User(username="extra", display_name="Extra")
        game = Game(title="Constraint Test", slug="constraint-test", description="Constraint test")
        session.add_all([user, game])
        session.flush()
        session.add(Rating(user_id=user.id, game_id=game.id, score=6))

        with pytest.raises(IntegrityError):
            session.commit()


def test_unique_review_per_user_and_game(session_factory):
    with session_factory() as session:
        user = session.query(User).filter_by(username="demo").one()
        game = session.query(Game).filter_by(slug="test-quest").one()
        session.add(Review(user_id=user.id, game_id=game.id, content="First review"))
        session.commit()

    with session_factory() as session:
        user = session.query(User).filter_by(username="demo").one()
        game = session.query(Game).filter_by(slug="test-quest").one()
        session.add(Review(user_id=user.id, game_id=game.id, content="Second review"))

        with pytest.raises(IntegrityError):
            session.commit()
