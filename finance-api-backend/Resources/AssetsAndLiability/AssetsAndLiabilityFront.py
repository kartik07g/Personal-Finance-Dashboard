from sqlalchemy.orm import Session
from .AssetsAndLiabilityService import AssetsAndLiabilityService
from .AssetsAndLiabilityServiceInterface import AssetsAndLiabilityServiceInterface
from schemas.assets_and_liabilities import AssetsAndLiabilityCreate, AssetsAndLiabilityUpdate

class AssetsAndLiabilityFront:
    def __init__(self):
        self.asset_and_liability_service : AssetsAndLiabilityServiceInterface = AssetsAndLiabilityService()

    def create_asset_and_liability(self, db: Session, user_id: str, asset_and_liability_data: AssetsAndLiabilityCreate):
        return self.asset_and_liability_service.create_asset_and_liability(db, user_id, asset_and_liability_data)

    def get_asset_and_liability(self, db: Session, assetliab_id: str):
        return self.asset_and_liability_service.get_asset_and_liability(db, assetliab_id)

    def get_assets_and_liabilities(self, db: Session, user_id: str):
        return self.asset_and_liability_service.get_assets_and_liabilities(db, user_id)

    def update_asset_and_liability(self, db: Session, assetliab_id: str, asset_and_liability_data: AssetsAndLiabilityUpdate):
        return self.asset_and_liability_service.update_asset_and_liability(db, assetliab_id, asset_and_liability_data)

    def delete_asset_and_liability(self, db: Session, assetliab_id: str):
        return self.asset_and_liability_service.delete_asset_and_liability(db, assetliab_id)
