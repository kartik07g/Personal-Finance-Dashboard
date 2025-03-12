from abc import ABC, abstractmethod

class LiabilitiesServiceInterface(ABC):
    @staticmethod
    @abstractmethod
    def create_liability(db, user_id, liability_data):
        pass

    @staticmethod
    @abstractmethod
    def get_liability(db, liability_id):
        pass

    @staticmethod
    @abstractmethod
    def get_liabilities(db, user_id):
        pass

    @staticmethod
    @abstractmethod
    def update_liability(db, liability_id, liability_data):
        pass

    @staticmethod
    @abstractmethod
    def delete_liability(db, liability_id):
        pass
