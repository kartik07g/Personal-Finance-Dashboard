from sqlalchemy.orm import Session
from models.liabilities import Liabilities
from schemas.liabilities import LiabilityCreate, LiabilityUpdate
from fastapi import HTTPException
from datetime import datetime
import uuid

class LiabilitiesService:
    def create_liability(self, db: Session, user_id: str, liability_data: LiabilityCreate):
        print("liability_data",liability_data)
        liability = Liabilities(
            user_id=user_id,
            name=liability_data.name,
            amount=liability_data.amount
        )
        db.add(liability)
        db.commit()
        db.refresh(liability)
        return liability

    def get_liability(self, db: Session, liability_id: str):
        liability = db.query(Liabilities).filter(Liabilities.liability_id == liability_id).first()
        if not liability:
            raise HTTPException(status_code=404, detail="Liability not found")
        return liability

    def get_liabilities(self, db: Session, user_id: str):
        return db.query(Liabilities).filter(Liabilities.user_id == user_id).all()

    def update_liability(self, db: Session, liability_id: str, liability_data: LiabilityUpdate):
        liability = db.query(Liabilities).filter(Liabilities.liability_id == liability_id).first()
        if not liability:
            raise HTTPException(status_code=404, detail="Liability not found")

        if liability_data.name:
            liability.name = liability_data.name
        if liability_data.amount:
            liability.amount = liability_data.amount

        liability.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(liability)
        return liability

    def delete_liability(self, db: Session, liability_id: str):
        liability = db.query(Liabilities).filter(Liabilities.liability_id == liability_id).first()
        if not liability:
            raise HTTPException(status_code=404, detail="Liability not found")

        db.delete(liability)
        db.commit()
        return {"message": "Liability deleted successfully"}
