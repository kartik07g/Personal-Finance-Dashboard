from fastapi import APIRouter, Depends
from Resources.UserAuth.UserAuthServiceInterface import UserAuthServiceInterface
from Resources.UserAuth.UserAuthService import UserAuthService

class UserAuthFront:
    def __init__(self):
        self.userauth_service: UserAuthServiceInterface = UserAuthService()

    def signup(self, db, user_data):
        return self.userauth_service.register_user(db, user_data)

    def signin(self, db, user_data):
        return self.userauth_service.authenticate_user(db, user_data)


