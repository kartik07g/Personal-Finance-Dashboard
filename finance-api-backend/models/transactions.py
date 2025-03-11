from sqlalchemy import Column, Integer, String, Enum, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from core.database import Base

class Transactions(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category = Column(Enum("Income", "Expense", name="transaction_category"), nullable=False)
    type = Column(String(50), nullable=False)  # Salary, Rent, Food, etc.
    amount = Column(Numeric(10, 2), nullable=False)
    description = Column(String(255), nullable=True)
    date = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Define relationship (optional, useful for querying user transactions)
    user = relationship("User", back_populates="transactions")