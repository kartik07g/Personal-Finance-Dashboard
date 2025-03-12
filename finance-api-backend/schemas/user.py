from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str  # Password should be included in request but not response

class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True  # Enable ORM serialization

class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None

class UserResponseSchema(BaseModel):
    user_id: str
    name: str
    email: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True