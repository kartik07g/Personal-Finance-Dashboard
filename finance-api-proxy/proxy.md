# 🌐 finance-api-proxy Routes Documentation

This document outlines the API routes handled by the **Node.js Express Proxy Layer** in the Personal Finance Dashboard project.

The proxy serves as a middleware between the **React frontend** and the **FastAPI backend**, handling routing and middleware logic such as authentication, logging, and security.

---

## 🚀 Route Overview

| Route Group                | Base Path              | Description                                      |
|----------------------------|------------------------|--------------------------------------------------|
| Transactions Routes        | `/transactions`        | Handles all CRUD operations for transactions     |
| Users Routes               | `/users`               | User profile related routes                      |
| Assets & Liabilities Routes| `/assetsliabs`  | Manage user assets and liabilities               |
| User Authentication Routes | `/auth`                | Handles registration, login, logout, token flow  |         |
| Dashboard Routes           | `/dashboard`           | Retrieves financial dashboard summary            |

---

## 🗺️ Detailed Route Explanation

### 1️⃣ **Transactions Routes** (`/proxy/transactions`)
Handles income and expense transactions.

- `GET /transactions` → Get transaction by ID
- `POST /transactions/create` → Create a new transaction
- `PATCH /transactions/update/:id` → Update transaction
- `DELETE /transactions/remove/:id` → Delete transaction

---

### 2️⃣ **Users Routes** (`/proxy/user`)
Manage user data.

- `GET /user/users/:id` → Get user details
- `PATCH /user/update/` → Update user details
- `DELETE /user/remove/:id` → Delete user account

---

### 3️⃣ **Assets and Liabilities Routes** (`/proxy/assetsliabs`)
Track and manage user assets and liabilities.

- `GET /assetsliabs/` → Get asset/liability 
- `POST /assetsliabs/create` → Add asset/liability
- `PATCH /assetsliabs/update/:id` → Update asset/liability
- `DELETE /assetsliabs/remove/:id` → Delete asset/liability

---

### 4️⃣ **User Authentication Routes** (`/proxy/auth`)
Handles user registration and login.

- `POST /auth/signup` → Register new user
- `POST /auth/signin` → User login (returns JWT)
- `GET /auth/google/callback` → Resgisters/Logins User ans returns JWT

---

### 5️⃣ **Dashboard Routes** (`/proxy/generate-report`)
Provide financial dashboard summaries.

- `GET /generate-report` → Get consolidated financial summary (total assets, liabilities, income, expenses)

---

## 🛡️ Security Middleware (Global)

- **Helmet.js** → Secures HTTP headers
- **CORS** → Restricts API to frontend origin
- **JWT Verification** → Most routes are protected with JWT token checks

---

## 📌 Notes

- All API calls from the React frontend are made via this proxy on `/proxy` prefix (e.g., `/proxy/transactions`, `/proxy/auth/login`)
- The proxy forwards validated requests to the backend FastAPI service.

---


