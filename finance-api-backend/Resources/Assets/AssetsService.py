from sqlalchemy.orm import Session
from models.assets import Assets
from schemas.assets import AssetCreate, AssetUpdate
from fastapi import HTTPException
from datetime import datetime
from .AssetsServiceInterface import AssetsServiceInterface
import uuid

class AssetsService(AssetsServiceInterface):
    def create_asset(self, db: Session, user_id: str, asset_data: AssetCreate):
        asset = Assets(
            user_id=user_id,
            name=asset_data.name,
            value=asset_data.value
        )
        db.add(asset)
        db.commit()
        db.refresh(asset)
        return asset

    def get_asset(self, db: Session, asset_id: str):
        asset = db.query(Assets).filter(Assets.asset_id == asset_id).first()
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")
        return asset

    def get_assets(self, db: Session, user_id: str):
        return db.query(Assets).filter(Assets.user_id == user_id).all()

    def update_asset(self, db: Session, asset_id: str, asset_data: AssetUpdate):
        asset = db.query(Assets).filter(Assets.asset_id == asset_id).first()
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")

        if asset_data.name:
            asset.name = asset_data.name
        if asset_data.value:
            asset.value = asset_data.value

        asset.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(asset)
        return asset

    def delete_asset(self, db: Session, asset_id: str):
        asset = db.query(Assets).filter(Assets.asset_id == asset_id).first()
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")

        db.delete(asset)
        db.commit()
        return {"message": "Asset deleted successfully"}
