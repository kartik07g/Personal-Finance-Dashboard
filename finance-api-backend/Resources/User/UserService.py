from sqlalchemy.orm import Session
from models.user import Users
from core.auth_utils import hash_password, verify_password, create_access_token
from fastapi import HTTPException, status
from schemas.user import UserCreate, UserUpdate, UserResponseSchema
from typing import List, Optional

class UserService:

    def logout_user(self):
        return {"message": "User logged out successfully"}

    def get_users(self, db: Session, current_user, authToken: Optional[str] = None):
        """
        Fetch all users if no user_id is provided, else fetch a specific user.
        Convert SQLAlchemy model to Pydantic response schema.
        """
        if authToken:
            user = db.query(Users).filter(Users.user_id == current_user.user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
            
            return UserResponseSchema.model_validate(user)  # ✅ Convert to Pydantic schema

        users = db.query(Users).all()
        if not users:
            raise HTTPException(status_code=404, detail="No users found")

        return [UserResponseSchema.model_validate(user) for user in users] 

    def update_user_details(self, db: Session, user_data: UserUpdate, current_user: Users):
        user = db.query(Users).filter(Users.user_id == current_user.user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        updated = False  # Track if any field is updated

        if user_data.name is not None and user_data.name.strip():
            user.name = user_data.name
            updated = True

        if user_data.email is not None and user_data.email.strip():
            # Optional: Add email verification step
            user.email = user_data.email
            updated = True

        if updated:
            db.commit()
            db.refresh(user)

        return {"message": "User updated successfully", "user": {"id": user.user_id, "name": user.name, "email": user.email}}

    def delete_user(self, user_id, db: Session, current_user):
        user = db.query(Users).filter(Users.user_id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        db.delete(user)
        db.commit()
        return {"message": "User deleted successfully"}
