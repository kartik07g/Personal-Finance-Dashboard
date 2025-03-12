from sqlalchemy.orm import Session
from .AssetsService import AssetsService
from .AssetsServiceInterface import AssetsServiceInterface
from schemas.assets import AssetCreate, AssetUpdate

class AssetsFront:
    def __init__(self):
        self.asset_service : AssetsServiceInterface = AssetsService()

    def create_asset(self, db: Session, user_id: str, asset_data: AssetCreate):
        return self.asset_service.create_asset(db, user_id, asset_data)

    def get_asset(self, db: Session, asset_id: str):
        return self.asset_service.get_asset(db, asset_id)

    def get_assets(self, db: Session, user_id: str):
        return self.asset_service.get_assets(db, user_id)

    def update_asset(self, db: Session, asset_id: str, asset_data: AssetUpdate):
        return self.asset_service.update_asset(db, asset_id, asset_data)

    def delete_asset(self, db: Session, asset_id: str):
        return self.asset_service.delete_asset(db, asset_id)
