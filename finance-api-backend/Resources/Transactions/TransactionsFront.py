from sqlalchemy.orm import Session
from schemas import TransactionCreate, TransactionUpdate
from .TransactionsServiceInterface import TransactionsServiceInterface
from .TransactionsService import TransactionsService

class TransactionsFront:
    def __init__(self):
        self.transactions_service : TransactionsServiceInterface = TransactionsService()

    def create_transaction(self, db: Session, user_id: str, transaction_data: TransactionCreate):
        return self.transactions_service.create_transaction(db, user_id, transaction_data)

    def get_transaction(self, db: Session, transaction_id: str):
        return self.transactions_service.get_transaction(db, transaction_id)

    def get_transactions(self, db: Session, user_id: str):
        return self.transactions_service.get_transactions(db, user_id)

    def update_transaction(self, db: Session, transaction_id: str, transaction_data: TransactionUpdate):
        return self.transactions_service.update_transaction(db, transaction_id, transaction_data)

    def delete_transaction(self, db: Session, transaction_id: str):
        return self.transactions_service.delete_transaction(db, transaction_id)
