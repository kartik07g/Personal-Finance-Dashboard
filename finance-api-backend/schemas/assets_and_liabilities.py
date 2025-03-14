from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AssetsAndLiabilityBase(BaseModel):
    name: str
    type: str
    value: float

class AssetsAndLiabilityCreate(AssetsAndLiabilityBase):
    pass  # No additional fields required for creation

class AssetsAndLiabilityUpdate(BaseModel):  # 🔹 Partial update for PATCH
    name: Optional[str] = None
    type: Optional[str] = None
    value: Optional[float] = None

class AssetsAndLiabilityResponse(AssetsAndLiabilityBase):
    assetliab_id: str
    user_id: str
    type: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True
