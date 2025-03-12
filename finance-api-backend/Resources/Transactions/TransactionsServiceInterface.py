from abc import ABC, abstractmethod

class TransactionsServiceInterface(ABC):
    @staticmethod
    @abstractmethod
    def create_transaction(db, user_id, transaction_data):
        pass

    @staticmethod
    @abstractmethod
    def get_transaction(db, transaction_id):
        pass

    @staticmethod
    @abstractmethod
    def get_transactions(db, user_id):
        pass

    @staticmethod
    @abstractmethod
    def update_transaction(db, transaction_id, transaction_data):
        pass

    @staticmethod
    @abstractmethod
    def delete_transaction(db, transaction_id):
        pass
