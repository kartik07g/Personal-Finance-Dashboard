from sqlalchemy.orm import Session
from .LiabilitiesService import LiabilitiesService
from .LiabilitiesServiceInterface import LiabilitiesServiceInterface
from schemas.liabilities import LiabilityCreate, LiabilityUpdate

class LiabilitiesFront:
    def __init__(self):
        self.liability_service : LiabilitiesServiceInterface = LiabilitiesService()

    def create_liability(self, db: Session, user_id: str, liability_data: LiabilityCreate):
        return self.liability_service.create_liability(db, user_id, liability_data)

    def get_liability(self, db: Session, liability_id: str):
        return self.liability_service.get_liability(db, liability_id)

    def get_liabilities(self, db: Session, user_id: str):
        return self.liability_service.get_liabilities(db, user_id)

    def update_liability(self, db: Session, liability_id: str, liability_data: LiabilityUpdate):
        return self.liability_service.update_liability(db, liability_id, liability_data)

    def delete_liability(self, db: Session, liability_id: str):
        return self.liability_service.delete_liability(db, liability_id)
