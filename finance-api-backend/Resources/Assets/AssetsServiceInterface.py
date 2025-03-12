from abc import ABC, abstractmethod

class AssetsServiceInterface(ABC):
    @staticmethod
    @abstractmethod
    def create_asset(db, user_id, asset_data):
        pass

    @staticmethod
    @abstractmethod
    def get_asset(db, asset_id):
        pass

    @staticmethod
    @abstractmethod
    def get_assets(db, user_id):
        pass

    @staticmethod
    @abstractmethod
    def update_asset(db, asset_id, asset_data):
        pass

    @staticmethod
    @abstractmethod
    def delete_asset(db, asset_id):
        pass
