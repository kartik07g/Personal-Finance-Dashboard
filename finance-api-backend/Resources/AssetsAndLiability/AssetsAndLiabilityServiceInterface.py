from abc import ABC, abstractmethod

class AssetsAndLiabilityServiceInterface(ABC):
    @staticmethod
    @abstractmethod
    def create_asset_and_liability(db, user_id, asset_and_liability_data):
        pass

    @staticmethod
    @abstractmethod
    def get_asset_and_liability(db, assetliab_id):
        pass

    @staticmethod
    @abstractmethod
    def get_assets_and_liabilities(db, user_id):
        pass

    @staticmethod
    @abstractmethod
    def update_asset_and_liability(db, assetliab_id, asset_and_liability_data):
        pass

    @staticmethod
    @abstractmethod
    def delete_asset_and_liability(db, assetliab_id):
        pass
