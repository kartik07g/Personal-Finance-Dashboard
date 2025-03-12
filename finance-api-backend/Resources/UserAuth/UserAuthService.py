from sqlalchemy.orm import Session
from models import Users
from core.auth_utils import hash_password, verify_password, create_access_token
from schemas import UserCreate, UserLogin
from fastapi import HTTPException
from .UserAuthServiceInterface import UserAuthServiceInterface

class UserAuthService(UserAuthServiceInterface):
    def register_user(self, db: Session, user_data: UserCreate):
        existing_user = db.query(Users).filter(Users.email == user_data.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_password = hash_password(user_data.password)
        new_user = Users(name=user_data.name, email=user_data.email, password=hashed_password)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "User registered successfully"}

    def authenticate_user(self, db: Session, login_data: UserLogin):
        user = db.query(Users).filter(Users.email == login_data.email).first()
        if not user or not verify_password(login_data.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_access_token({"sub": user.user_id})
        return {"access_token": token, "token_type": "bearer"}
