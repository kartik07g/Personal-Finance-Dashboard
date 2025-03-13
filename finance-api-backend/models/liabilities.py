import uuid
from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime

class Liabilities(Base):
    __tablename__ = "liabilities"

    liability_id = Column(String, primary_key=True, unique=True, index=True)  # Custom Liability ID
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)  # Link to Users table
    name = Column(String, nullable=False)  # Loans, credit card debt, etc.
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True)

    # Relationship
    user = relationship("Users", back_populates="liabilities")

    def __init__(self, user_id, name, amount):
        self.liability_id = self.generate_liability_id()
        self.user_id = user_id
        self.name = name
        self.amount = amount

    @staticmethod
    def generate_liability_id():
        """Generate a unique liability ID like 'LIAB1234567'"""
        return f"LIAB{uuid.uuid4().int % 10000000}"  # LIAB + 7-digit number
