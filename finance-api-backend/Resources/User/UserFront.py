from .UserService import UserService
from .UserServiceInterface import UserServiceInterface
from schemas.user import UserCreate, UserUpdate

class UserFront:
    def __init__(self):
        self.user_service: UserServiceInterface = UserService()

    def logout(self):
        return self.user_service.logout_user()

    def get_users(self, db, authToken: str, current_user):
        return self.user_service.get_users(db, current_user, authToken)

    def update_user(self, db, user_data: UserUpdate, current_user):
        return self.user_service.update_user_details(db, user_data, current_user)

    def remove_user(self,user_id, db, current_user):
        return self.user_service.delete_user(user_id, db, current_user)
