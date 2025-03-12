import uuid
from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime

class Transactions(Base):
    __tablename__ = "transactions"

    transaction_id = Column(String, primary_key=True, unique=True, index=True)  # Custom Transaction ID
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)  # Link to Users table
    type = Column(String, nullable=False)  # "income" or "expense"
    category = Column(String, nullable=False)  # Salary, Rent, Food, etc.
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    user = relationship("Users", back_populates="transactions")

    def __init__(self, user_id, type, category, amount):
        self.transaction_id = self.generate_transaction_id()
        self.user_id = user_id
        self.type = type
        self.category = category
        self.amount = amount

    @staticmethod
    def generate_transaction_id():
        """Generate a unique transaction ID like 'TXN1234567'"""
        return f"TXN{uuid.uuid4().int % 10000000}"  # TXN + 7-digit number
