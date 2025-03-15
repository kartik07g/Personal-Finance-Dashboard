from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.user import UserCreate, UserUpdate, UserResponseSchema
from core.database import get_db
from core.auth_utils import login_required, get_current_user
from .UserFront import UserFront
from typing import List, Optional

user_router = APIRouter(prefix="/backend/user", tags=["User"])


@user_router.post("/signout")
@login_required
def signout():
    return UserFront().logout()

# @user_router.get("/testauth")
# def test_auth(db: Session = Depends(get_db),current_user: Depends(get_current_user)):
#     return {"user_id": current_user.id}
@user_router.get("/users", response_model=List[UserResponseSchema])
@user_router.get("/users/{authToken}", response_model=UserResponseSchema)
def get_users(authToken: Optional[str] = None, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return UserFront().get_users(db, authToken, current_user)

@user_router.patch("/update")
def update_user(user_data: UserUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return UserFront().update_user(db, user_data, current_user)

@user_router.delete("/remove/{user_id}")
def remove_user(user_id ,db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return UserFront().remove_user(user_id, db, current_user)
