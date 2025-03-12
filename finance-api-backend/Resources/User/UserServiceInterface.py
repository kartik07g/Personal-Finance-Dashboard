from abc import ABC, abstractmethod

class UserServiceInterface(ABC):
    @staticmethod
    @abstractmethod
    def signout():
        pass

    @staticmethod
    @abstractmethod
    def get_users(db, user_id, user_data):
        pass

    @staticmethod
    @abstractmethod
    def update_user(db, user_data, current_user):
        pass

    @staticmethod
    @abstractmethod
    def remove_user():
        pass
