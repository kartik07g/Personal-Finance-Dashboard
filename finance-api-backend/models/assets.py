import uuid
from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime

class Assets(Base):
    __tablename__ = "assets"

    asset_id = Column(String, primary_key=True, unique=True, index=True)  # Custom Asset ID
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)  # Link to Users table
    name = Column(String, nullable=False)  # Bank balance, property, stocks, etc.
    value = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True)

    # Relationship
    user = relationship("Users", back_populates="assets")

    def __init__(self, user_id, name, value):
        self.asset_id = self.generate_asset_id()
        self.user_id = user_id
        self.name = name
        self.value = value

    @staticmethod
    def generate_asset_id():
        """Generate a unique asset ID like 'ASSET1234567'"""
        return f"ASSET{uuid.uuid4().int % 10000000}"  # ASSET + 7-digit number
