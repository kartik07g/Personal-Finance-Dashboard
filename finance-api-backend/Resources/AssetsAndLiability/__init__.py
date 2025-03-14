from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.auth_utils import get_current_user
from schemas.assets_and_liabilities import AssetsAndLiabilityCreate, AssetsAndLiabilityUpdate, AssetsAndLiabilityResponse
from typing import List
from .AssetsAndLiabilityFront import AssetsAndLiabilityFront

asset_and_liability_router = APIRouter(prefix="/backend/assetsliabs", tags=["AssetsAndLiability"])

@asset_and_liability_router.get("/", response_model=List[AssetsAndLiabilityResponse])
def get_assets(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return AssetsAndLiabilityFront().get_assets_and_liabilities(db, current_user.user_id)

@asset_and_liability_router.get("/{assetliab_id}", response_model=AssetsAndLiabilityResponse)
def get_asset(assetliab_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return AssetsAndLiabilityFront().get_asset_and_liability(db, assetliab_id)

@asset_and_liability_router.post("/create", response_model=AssetsAndLiabilityResponse)
def create_asset(asset_and_liability_data: AssetsAndLiabilityCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return AssetsAndLiabilityFront().create_asset_and_liability(db, current_user.user_id, asset_and_liability_data)

@asset_and_liability_router.patch("/update/{assetliab_id}", response_model=AssetsAndLiabilityResponse)  # 🔹 Updated from PUT to PATCH
def update_asset(assetliab_id: str, asset_and_liability_data: AssetsAndLiabilityUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return AssetsAndLiabilityFront().update_asset_and_liability(db, assetliab_id, asset_and_liability_data)

@asset_and_liability_router.delete("/remove/{assetliab_id}")
def delete_asset(assetliab_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return AssetsAndLiabilityFront().delete_asset_and_liability(db, assetliab_id)
