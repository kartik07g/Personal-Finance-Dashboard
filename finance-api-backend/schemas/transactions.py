from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# Base Schema (shared properties)
class TransactionBase(BaseModel):
    type: str = Field(..., description="Type of transaction: income or expense")
    category: str = Field(..., description="Category of the transaction, e.g., Salary, Rent")
    amount: float = Field(..., description="Transaction amount")

# Schema for Creating a Transaction
class TransactionCreate(TransactionBase):
    pass  # Inherits all fields from TransactionBase

# Schema for Updating a Transaction
class TransactionUpdate(TransactionBase):
    type: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = None

# Schema for Response (Read)
class TransactionResponse(TransactionBase):
    transaction_id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True  # Allows SQLAlchemy conversion
