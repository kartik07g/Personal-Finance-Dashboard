from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from models.transactions import Transactions
from schemas import TransactionCreate, TransactionUpdate, TransactionResponse
from .TransactionsServiceInterface import TransactionsServiceInterface
from datetime import datetime

class TransactionsService(TransactionsServiceInterface):

    def create_transaction(self, db: Session, user_id: str, transaction_data: TransactionCreate):
        """Create a new transaction."""
        try:
            transaction = Transactions(
                user_id=user_id,
                type=transaction_data.type,
                category=transaction_data.category,
                amount=transaction_data.amount
            )
            db.add(transaction)
            db.commit()
            db.refresh(transaction)
            return TransactionResponse.model_validate(transaction)
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error while creating transaction: {str(e)}")

    def get_transaction(self, db: Session, transaction_id: str):
        """Retrieve a single transaction by ID."""
        try:
            transaction = db.query(Transactions).filter(Transactions.transaction_id == transaction_id).first()
            if not transaction:
                raise HTTPException(status_code=404, detail="Transaction not found")
            return TransactionResponse.model_validate(transaction)
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=f"Database error while retrieving transaction: {str(e)}")

    def get_transactions(self, db: Session, user_id: str):
        """Retrieve all transactions for a user."""
        try:
            transactions = (
                db.query(Transactions)
                .filter(Transactions.user_id == user_id)
                .order_by(Transactions.created_at.desc())
                .all()
            )
            return [TransactionResponse.model_validate(txn) for txn in transactions]
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=f"Database error while retrieving transactions: {str(e)}")

    def update_transaction(self, db: Session, transaction_id: str, transaction_data: TransactionUpdate):
        """Update an existing transaction."""
        try:
            transaction = db.query(Transactions).filter(Transactions.transaction_id == transaction_id).first()
            if not transaction:
                raise HTTPException(status_code=404, detail="Transaction not found")

            for key, value in transaction_data.model_dump(exclude_unset=True).items():
                setattr(transaction, key, value)

            transaction.updated_at = datetime.utcnow()

            db.commit()
            db.refresh(transaction)
            return TransactionResponse.model_validate(transaction)
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error while updating transaction: {str(e)}")

    def delete_transaction(self, db: Session, transaction_id: str):
        """Delete a transaction by ID."""
        try:
            transaction = db.query(Transactions).filter(Transactions.transaction_id == transaction_id).first()
            if not transaction:
                raise HTTPException(status_code=404, detail="Transaction not found")

            db.delete(transaction)
            db.commit()
            return {"message": "Transaction deleted successfully"}
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error while deleting transaction: {str(e)}")
