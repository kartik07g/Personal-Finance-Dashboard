from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from models.user import Users
from core.auth_utils import hash_password, verify_password, create_access_token
from fastapi import HTTPException, status
from schemas.user import UserCreate, UserUpdate, UserResponseSchema
from typing import List, Optional

class UserService:

    def logout_user(self):
        return {"message": "User logged out successfully"}

    def get_users(self, db: Session, current_user, authToken: Optional[str] = None):
        try:
            if authToken:
                user = db.query(Users).filter(Users.user_id == current_user.user_id).first()
                if not user:
                    raise HTTPException(status_code=404, detail="User not found")

                return UserResponseSchema.model_validate(user)

            users = db.query(Users).all()
            if not users:
                raise HTTPException(status_code=404, detail="No users found")

            return [UserResponseSchema.model_validate(user) for user in users]

        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

    def update_user_details(self, db: Session, user_data: UserUpdate, current_user: Users):
        try:
            user = db.query(Users).filter(Users.user_id == current_user.user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            updated = False

            if user_data.name is not None and user_data.name.strip():
                user.name = user_data.name
                updated = True

            if user_data.email is not None and user_data.email.strip():
                user.email = user_data.email
                updated = True

            if updated:
                db.commit()
                db.refresh(user)

            return {
                "message": "User updated successfully",
                "user": {"id": user.user_id, "name": user.name, "email": user.email}
            }

        except IntegrityError as e:
            db.rollback()
            raise HTTPException(status_code=400, detail="Integrity error, check your inputs")
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

    def delete_user(self, user_id, db: Session, current_user):
        try:
            user = db.query(Users).filter(Users.user_id == user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            db.delete(user)
            db.commit()
            return {"message": "User deleted successfully"}

        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")