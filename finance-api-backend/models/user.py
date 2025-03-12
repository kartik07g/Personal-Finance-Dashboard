import uuid
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime

class Users(Base):
    __tablename__ = "users"

    user_id = Column(String, primary_key=True, unique=True, index=True)  # Custom User ID
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    # Relationships
    transactions = relationship("Transactions", back_populates="user", cascade="all, delete-orphan")
    assets = relationship("Assets", back_populates="user", cascade="all, delete-orphan")
    liabilities = relationship("Liabilities", back_populates="user", cascade="all, delete-orphan")

    def __init__(self, name, email, password):
        self.user_id = self.generate_user_id()
        self.name = name
        self.email = email
        self.password = password

    @staticmethod
    def generate_user_id():
        """Generate a unique user ID like 'USER1234567'"""
        return f"USER{uuid.uuid4().int % 10000000}"  # USER + 7-digit number
