from datetime import date

from sqlalchemy import Date, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import CreatedAtMixin


class Game(CreatedAtMixin, Base):
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200), index=True)
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text())
    developer: Mapped[str | None] = mapped_column(String(120), nullable=True)
    publisher: Mapped[str | None] = mapped_column(String(120), nullable=True)
    release_date: Mapped[date | None] = mapped_column(Date(), nullable=True)
    cover_image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    avg_rating: Mapped[float] = mapped_column(Float(), default=0.0, server_default="0")
    rating_count: Mapped[int] = mapped_column(Integer(), default=0, server_default="0")
    review_count: Mapped[int] = mapped_column(Integer(), default=0, server_default="0")

    genre_links = relationship(
        "GameGenre",
        back_populates="game",
        cascade="all, delete-orphan",
    )
    platform_links = relationship(
        "GamePlatform",
        back_populates="game",
        cascade="all, delete-orphan",
    )
    ratings = relationship("Rating", back_populates="game", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="game", cascade="all, delete-orphan")
