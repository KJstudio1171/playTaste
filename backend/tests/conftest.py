from datetime import date

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.game import Game
from app.models.game_genre import GameGenre
from app.models.game_platform import GamePlatform
from app.models.genre import Genre
from app.models.platform import Platform
from app.models.rating import Rating
from app.models.review import Review
from app.models.user import User
from app.services.aggregates import refresh_game_aggregates


@pytest.fixture()
def session_factory():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)
    Base.metadata.create_all(engine)

    with TestingSessionLocal() as session:
        demo = User(username="demo", display_name="Demo", bio="Test user", avatar_url="https://example.com/demo.png")
        critic = User(username="critic", display_name="Critic", bio="Critic user", avatar_url="https://example.com/critic.png")
        genre = Genre(name="Action RPG", slug="action-rpg")
        platform = Platform(name="PC", slug="pc")
        game = Game(
            title="Test Quest",
            slug="test-quest",
            description="A test game.",
            developer="Test Dev",
            publisher="Test Pub",
            release_date=date(2024, 1, 1),
            cover_image_url="https://example.com/game.png",
        )
        game.genre_links = [GameGenre(genre=genre)]
        game.platform_links = [GamePlatform(platform=platform)]
        session.add_all([demo, critic, genre, platform, game])
        session.flush()

        rating = Rating(user_id=critic.id, game_id=game.id, score=4)
        review = Review(user_id=critic.id, game_id=game.id, content="Solid baseline review for testing.")
        session.add_all([rating, review])
        session.flush()
        refresh_game_aggregates(session, game)
        session.commit()

    yield TestingSessionLocal

    app.dependency_overrides.clear()
    Base.metadata.drop_all(engine)


@pytest.fixture()
def client(session_factory):
    def override_get_db():
        db: Session = session_factory()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)
