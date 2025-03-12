from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.auth_utils import get_current_user
from schemas.assets import AssetCreate, AssetUpdate, AssetResponse
from typing import List
from .AssetsFront import AssetsFront

asset_router = APIRouter(prefix="/backend/assets", tags=["Assets"])

@asset_router.get("/", response_model=List[AssetResponse])
def get_assets(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return AssetsFront().get_assets(db, current_user.user_id)

@asset_router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(asset_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return AssetsFront().get_asset(db, asset_id)

@asset_router.post("/create", response_model=AssetResponse)
def create_asset(asset_data: AssetCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return AssetsFront().create_asset(db, current_user.user_id, asset_data)

@asset_router.patch("/update/{asset_id}", response_model=AssetResponse)  # 🔹 Updated from PUT to PATCH
def update_asset(asset_id: str, asset_data: AssetUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return AssetsFront().update_asset(db, asset_id, asset_data)

@asset_router.delete("/remove/{asset_id}")
def delete_asset(asset_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return AssetsFront().delete_asset(db, asset_id)
