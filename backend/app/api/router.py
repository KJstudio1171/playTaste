from fastapi import APIRouter

from app.api.routes import auth, games, health, users


api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(games.router, prefix="/games", tags=["games"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
