from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.auth_utils import get_current_user
from schemas import TransactionCreate, TransactionUpdate, TransactionResponse
from typing import List
from .TransactionsFront import TransactionsFront

transaction_router = APIRouter(prefix="/backend/transactions", tags=["Transactions"])

@transaction_router.get("/", response_model=List[TransactionResponse])
def get_transactions(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return TransactionsFront().get_transactions(db, current_user.user_id)

@transaction_router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return TransactionsFront().get_transaction(db, transaction_id)

@transaction_router.post("/create", response_model=TransactionResponse)
def create_transaction(transaction_data: TransactionCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return TransactionsFront().create_transaction(db, current_user.user_id, transaction_data)

@transaction_router.patch("/update/{transaction_id}", response_model=TransactionResponse)  # 🔹 Updated from PUT to PATCH
def update_transaction(transaction_id: str, transaction_data: TransactionUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return TransactionsFront().update_transaction(db, transaction_id, transaction_data)

@transaction_router.delete("/remove/{transaction_id}")
def delete_transaction(transaction_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return TransactionsFront().delete_transaction(db, transaction_id)
