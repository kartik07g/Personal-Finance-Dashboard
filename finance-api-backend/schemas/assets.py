from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AssetBase(BaseModel):
    name: str
    value: float

class AssetCreate(AssetBase):
    pass  # No additional fields required for creation

class AssetUpdate(BaseModel):  # 🔹 Partial update for PATCH
    name: Optional[str] = None
    value: Optional[float] = None

class AssetResponse(AssetBase):
    asset_id: str
    user_id: str
    created_at: datetime

    class Config:
        orm_mode = True
