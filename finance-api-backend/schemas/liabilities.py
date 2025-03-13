from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LiabilityBase(BaseModel):
    name: str
    amount: float

class LiabilityCreate(LiabilityBase):
    pass  # No additional fields required for creation

class LiabilityUpdate(BaseModel):  # 🔹 Supports partial update
    name: Optional[str] = None
    amount: Optional[float] = None

class LiabilityResponse(LiabilityBase):
    liability_id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True
