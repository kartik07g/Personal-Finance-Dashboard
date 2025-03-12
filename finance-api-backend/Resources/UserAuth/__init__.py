from fastapi import APIRouter, Depends
from core.database import get_db
from .UserAuthFront import UserAuthFront
from schemas import UserCreate, UserLogin
from sqlalchemy.orm import Session
from core.database import get_db


user_auth_router = APIRouter(prefix="/backend/auth", tags=["Authentication"])


@user_auth_router.post("/signup")
async def sign_up(user_data: UserCreate, db: Session = Depends(get_db)):
    return UserAuthFront().signup(db, user_data)

@user_auth_router.post("/signin")
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    return UserAuthFront().signin(db, login_data)