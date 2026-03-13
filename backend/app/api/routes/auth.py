from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.api import UserSummary
from app.services.serializers import serialize_user_summary


router = APIRouter()


@router.get("/me", response_model=UserSummary)
def read_me(current_user: User = Depends(get_current_user)) -> UserSummary:
    return serialize_user_summary(current_user)
