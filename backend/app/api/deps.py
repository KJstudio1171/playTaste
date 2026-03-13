from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User


def get_current_user(db: Session = Depends(get_db)) -> User:
    if not settings.demo_auth:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Demo auth is disabled.",
        )

    user = db.scalar(select(User).where(User.username == settings.demo_username))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Demo user was not found. Load seed data first.",
        )
    return user
