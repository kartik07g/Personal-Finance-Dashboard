from abc import ABC, abstractmethod

class UserServiceInterface(ABC):
    @staticmethod
    @abstractmethod
    def signout():
        pass

    @staticmethod
    @abstractmethod
    def get_users(db, current_user, authToken ):
        pass

    @staticmethod
    @abstractmethod
    def update_user(db, user_data, current_user):
        pass

    @staticmethod
    @abstractmethod
    def delete_user(user_id, db, current_user):
        pass
