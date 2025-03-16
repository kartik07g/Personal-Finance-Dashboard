from functools import wraps
from fastapi import Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from jose.exceptions import ExpiredSignatureError
from datetime import datetime, timedelta
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from models.user import Users  # Import your Users model
from core.database import get_db  # Import the DB session dependency
import json
import os

# Define password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Define OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/signin")

SECRET_KEY = os.getenv("JWT_ENCODE_SERCRET_KEY")  # Change this to a secure secret key
ALGORITHM = os.getenv("JWT_ENCODE_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Token expiration time

# Hash password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Create access token
def create_access_token(user_id: str, expires_delta: timedelta = None) -> str:
    """
    Generate a JWT token with a string-based user ID (e.g., 'USER1234567').
    """
    user_id = user_id.get('sub')
    if not isinstance(user_id, str) or not user_id.startswith("USER"):
        raise ValueError("User ID must be a string in the format 'USER1234567'")

    to_encode = {"sub": user_id}  # ✅ Store 'sub' as a string
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Get current user from token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Decode JWT token and retrieve the user based on user_id (string).
    """
    try:
        print("Received Token:", token)  # Debugging

        payload = jwt.decode(str(token), SECRET_KEY, algorithms=[ALGORITHM])
        print("Decoded Token Payload:", payload)  # Debugging

        user_id = payload.get("sub")  # Now expecting a string-based user_id

        if not isinstance(user_id, str) or not user_id.startswith("USER"):
            raise HTTPException(status_code=401, detail="Invalid token payload (sub is not a valid user ID)")

        user = db.query(Users).filter(Users.user_id == user_id).first()  # ✅ Query by `user_id`
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return user
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except JWTError as e:
        print("JWT Error:", str(e))  # Log error details
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# Middleware-based login_required decorator
def login_required(f):
    @wraps(f)
    async def decorated(*args, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db), **kwargs):
        if not token:
            raise HTTPException(status_code=401, detail="Token missing")
        
        user = get_current_user(token, db)  # Authenticate user
        kwargs["current_user"] = user  # Add user to kwargs
        
        return await f(*args, **kwargs)  # Call original function
    
    return decorated
