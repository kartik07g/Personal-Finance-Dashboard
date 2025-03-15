from sqlalchemy.orm import Session
from models import Users
from core.auth_utils import hash_password, verify_password, create_access_token
from schemas import UserCreate, UserLogin
from fastapi import HTTPException
from .UserAuthServiceInterface import UserAuthServiceInterface
from google.oauth2 import id_token
from google.auth.transport import requests
import uuid

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
    
    def google_oauth_register_or_login(self, db: Session, google_token):
        try:
            CLIENT_ID = '856805720033-2038136lchil4aoi3p4ial2c7i5ujtih.apps.googleusercontent.com'
            try:
                idinfo = id_token.verify_oauth2_token(google_token, requests.Request(), CLIENT_ID)
            except Exception as e:
                print(e)
            # userid = idinfo['sub']
            email = idinfo['email']
            name = idinfo.get('name', 'Google User')  # Get name if available

            user = db.query(Users).filter(Users.email == email).first()

            if user:
                # User exists, update user info if necessary
                # Add any other fields you want to update
                # user.updated_at = datetime.utcnow()
                db.commit() # commit changes.
                db.refresh(user) # refresh the user object.


            else:
                # User doesn't exist, create a new user
                user = Users(name=name, email=email, password=str(uuid.uuid4()))  # Generate random password.
                # new_user.user_id = new_user.generate_user_id()  # Generate user ID
                db.add(user)
                db.commit()
                db.refresh(user)
            token = create_access_token({"sub": user.user_id})
            return {"access_token": token, "token_type": "bearer"}

        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid Google token")

        except Exception as e: # Catch other potential exceptions.
            db.rollback() # rollback any changes if an error occurs.
            raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

    def authenticate_user(self, db: Session, login_data: UserLogin):
        user = db.query(Users).filter(Users.email == login_data.email).first()
        if not user or not verify_password(login_data.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_access_token({"sub": user.user_id})
        return {"access_token": token, "token_type": "bearer"}
