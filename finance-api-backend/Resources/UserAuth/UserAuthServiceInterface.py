from abc import ABC, abstractmethod
from sqlalchemy.orm import Session
from schemas import UserCreate, UserLogin

class UserAuthServiceInterface(ABC):
    @abstractmethod
    def register_user(self, db: Session, user_data: UserCreate):
        pass

    @abstractmethod
    def authenticate_user(self, db: Session, login_data: UserLogin):
        pass

    @abstractmethod
    def google_oauth_register_or_login(self, db: Session, google_token):
        pass
