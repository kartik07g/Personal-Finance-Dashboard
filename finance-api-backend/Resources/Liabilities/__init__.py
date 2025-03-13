from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.auth_utils import get_current_user
from schemas.liabilities import LiabilityCreate, LiabilityUpdate, LiabilityResponse
from typing import List
from .LiabilitiesFront import LiabilitiesFront

liability_router = APIRouter(prefix="/backend/liabilities", tags=["Liabilities"])

@liability_router.get("/", response_model=List[LiabilityResponse])
def get_liabilities(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return LiabilitiesFront().get_liabilities(db, current_user.user_id)

@liability_router.get("/{liability_id}", response_model=LiabilityResponse)
def get_liability(liability_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return LiabilitiesFront().get_liability(db, liability_id)

@liability_router.post("/create", response_model=LiabilityResponse)
def create_liability(liability_data: LiabilityCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    print("***********call in crate lib")
    return LiabilitiesFront().create_liability(db, current_user.user_id, liability_data)

@liability_router.patch("/update/{liability_id}", response_model=LiabilityResponse)  # 🔹 Using PATCH instead of PUT
def update_liability(liability_id: str, liability_data: LiabilityUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return LiabilitiesFront().update_liability(db, liability_id, liability_data)

@liability_router.delete("/remove/{liability_id}")
def delete_liability(liability_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return LiabilitiesFront().delete_liability(db, liability_id)
