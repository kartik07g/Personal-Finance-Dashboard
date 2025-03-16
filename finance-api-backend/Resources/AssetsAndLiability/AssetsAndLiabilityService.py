from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from models.assets_and_liabilities import AssetsAndLiability
from schemas.assets_and_liabilities import AssetsAndLiabilityCreate, AssetsAndLiabilityUpdate
from fastapi import HTTPException
from datetime import datetime
from .AssetsAndLiabilityServiceInterface import AssetsAndLiabilityServiceInterface

class AssetsAndLiabilityService(AssetsAndLiabilityServiceInterface):

    def create_asset_and_liability(self, db: Session, user_id: str, asset_and_liability_data: AssetsAndLiabilityCreate):
        try:
            asset_and_liability = AssetsAndLiability(
                user_id=user_id,
                name=asset_and_liability_data.name,
                type=asset_and_liability_data.type,
                value=asset_and_liability_data.value
            )
            db.add(asset_and_liability)
            db.commit()
            db.refresh(asset_and_liability)
            return asset_and_liability
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error while creating asset/liability: {str(e)}")

    def get_asset_and_liability(self, db: Session, assetliab_id: str):
        try:
            asset_and_liability = db.query(AssetsAndLiability).filter(AssetsAndLiability.assetliab_id == assetliab_id).first()
            if not asset_and_liability:
                raise HTTPException(status_code=404, detail="Asset/Liability not found")
            return asset_and_liability
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=f"Database error while retrieving asset/liability: {str(e)}")

    def get_assets_and_liabilities(self, db: Session, user_id: str):
        try:
            return db.query(AssetsAndLiability).filter(AssetsAndLiability.user_id == user_id).all()
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=f"Database error while retrieving assets/liabilities: {str(e)}")

    def update_asset_and_liability(self, db: Session, assetliab_id: str, asset_and_liability_data: AssetsAndLiabilityUpdate):
        try:
            asset_and_liability = db.query(AssetsAndLiability).filter(AssetsAndLiability.assetliab_id == assetliab_id).first()
            if not asset_and_liability:
                raise HTTPException(status_code=404, detail="Asset/Liability not found")

            if asset_and_liability_data.name:
                asset_and_liability.name = asset_and_liability_data.name
            if asset_and_liability_data.value:
                asset_and_liability.value = asset_and_liability_data.value
            if asset_and_liability_data.type:
                asset_and_liability.type = asset_and_liability_data.type

            asset_and_liability.updated_at = datetime.utcnow()

            db.commit()
            db.refresh(asset_and_liability)
            return asset_and_liability
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error while updating asset/liability: {str(e)}")

    def delete_asset_and_liability(self, db: Session, assetliab_id: str):
        try:
            asset_and_liability = db.query(AssetsAndLiability).filter(AssetsAndLiability.assetliab_id == assetliab_id).first()
            if not asset_and_liability:
                raise HTTPException(status_code=404, detail="Asset/Liability not found")

            db.delete(asset_and_liability)
            db.commit()
            return {"message": "Asset/Liability deleted successfully"}
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error while deleting asset/liability: {str(e)}")
