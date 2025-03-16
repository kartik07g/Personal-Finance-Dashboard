# Finance Backend API - README

This document provides an overview of the Finance Backend API, built using FastAPI.

## API Endpoints

### User Authentication (`/backend/auth`)

* **`POST /signup`**: Register a new user.
    * Request body: `UserCreate`
    * Response: `UserResponse`
* **`POST /signin`**: Log in with email and password.
    * Request body: `UserLogin`
    * Response: JWT token.
* **`POST /google/callback`**: Authenticate with Google OAuth.
    * Request Body: `GoogleToken`
    * Response: JWT token.

#### UserAuth Schemas

* **`UserLogin`**:
    * `email`: `EmailStr`
    * `password`: `str`
* **`GoogleToken`**:
    * `token`: `str`
* **`UserCreate`**:
    * Inherits from `UserBase`
    * `password`: `str` (not returned in response)
* **`UserResponse`**:
    * Inherits from `UserBase`
    * `id`: `int`
* **`UserUpdate`**:
    * `name`: `str` | `None`
    * `email`: `EmailStr` | `None`
* **`UserResponseSchema`**:
    * `user_id`: `str`
    * `name`: `str`
    * `email`: `str`
    * `is_active`: `bool`
    * `created_at`: `datetime`

### User Management (`/backend/user`)

* **`GET /users`**: Get all users or a specific user by authToken.
    * Response: `List[UserResponseSchema]`
* **`GET /users/{authToken}`**: Get a specific user by authToken.
    * Response: `UserResponseSchema`
* **`PATCH /update`**: Update user information.
    * Request body: `UserUpdate`
* **`DELETE /remove/{user_id}`**: Delete a user.

### Transactions (`/backend/transactions`)

* **`GET /`**: Get all transactions for the current user.
    * Response: `List[TransactionResponse]`
* **`GET /{transaction_id}`**: Get a specific transaction.
    * Response: `TransactionResponse`
* **`POST /create`**: Create a new transaction.
    * Request body: `TransactionCreate`
    * Response: `TransactionResponse`
* **`PATCH /update/{transaction_id}`**: Update an existing transaction.
    * Request body: `TransactionUpdate`
    * Response: `TransactionResponse`
* **`DELETE /remove/{transaction_id}`**: Delete a transaction.

#### Transaction Schemas

* **`TransactionBase`**:
    * `type`: `str` (income/expense)
    * `category`: `str`
    * `amount`: `float`
* **`TransactionCreate`**: Inherits from `TransactionBase`.
* **`TransactionUpdate`**:
    * `type`: `Optional[str]`
    * `category`: `Optional[str]`
    * `amount`: `Optional[float]`
* **`TransactionResponse`**:
    * `transaction_id`: `str`
    * `user_id`: `str`
    * `created_at`: `datetime`
    * `updated_at`: `Optional[datetime]`

### Reports (`/backend/generate-report`)

* **`POST /`**: Generate a report.
    * Request body: `ReportRequest`
    * Response: `ReportResponse`

#### Report Schemas

* **`ReportRequest`**:
    * `report_type`: `str`
* **`ReportResponse`**:
    * `data`: `List[Any]`

### Assets and Liabilities (`/backend/assetsliabs`)

* **`GET /`**: Get all assets and liabilities for the current user.
    * Response: `List[AssetsAndLiabilityResponse]`
* **`GET /{assetliab_id}`**: Get a specific asset or liability.
    * Response: `AssetsAndLiabilityResponse`
* **`POST /create`**: Create a new asset or liability.
    * Request body: `AssetsAndLiabilityCreate`
    * Response: `AssetsAndLiabilityResponse`
* **`PATCH /update/{assetliab_id}`**: Update an existing asset or liability.
    * Request body: `AssetsAndLiabilityUpdate`
    * Response: `AssetsAndLiabilityResponse`
* **`DELETE /remove/{assetliab_id}`**: Delete an asset or liability.

#### Assets and Liabilities Schemas

* **`AssetsAndLiabilityBase`**:
    * `name`: `str`
    * `type`: `str`
    * `value`: `float`
* **`AssetsAndLiabilityCreate`**: Inherits from `AssetsAndLiabilityBase`.
* **`AssetsAndLiabilityUpdate`**:
    * `name`: `Optional[str]`
    * `type`: `Optional[str]`
    * `value`: `Optional[float]`
* **`AssetsAndLiabilityResponse`**:
    * `assetliab_id`: `str`
    * `user_id`: `str`
    * `type`: `str`
    * `created_at`: `datetime`
    * `updated_at`: `Optional[datetime]`


## Authentication

* All protected endpoints require a valid JWT token in the `Authorization` header (`Bearer <token>`).
* The `get_current_user` dependency is used to extract the user from the JWT.