import uuid
from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime

class AssetsAndLiability(Base):
    __tablename__ = "assets_and_liabilities"

    assetliab_id = Column(String, primary_key=True, unique=True, index=True)  # Custom Asset ID
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)  # Link to Users table
    name = Column(String, nullable=False)  # Bank balance, property, stocks, etc.
    type = Column(String, nullable=False) # asset or liability
    value = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True)

    # Relationship
    user = relationship("Users", back_populates="assets_and_liabilities")

    def __init__(self, user_id, name, type, value):
        self.assetliab_id = self.generate_assetliab_id()
        self.user_id = user_id
        self.name = name
        self.type = type
        self.value = value

    @staticmethod
    def generate_assetliab_id():
        """Generate a unique asset ID like 'ASSETLIAB1234567'"""
        return f"ASSETLIAB{uuid.uuid4().int % 10000000}"  # ASSET + 7-digit number
