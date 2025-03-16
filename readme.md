# 💰 Personal Finance Dashboard

A full-stack, containerized web application that helps users track income, expenses, assets, liabilities, and view financial summaries through an interactive dashboard.

## 🚀 Overview

This project enables users to:
- Add and manage **transactions** (income/expenses)
- Track **assets and liabilities**
- View real-time **financial summaries**
- Securely manage data via **JWT Authentication**

### 🧱 Tech Stack

| Layer            | Tech                          |
|------------------|-------------------------------|
| Frontend         | ReactJS                       |
| API Proxy Layer  | Node.js (Express)             |
| Backend API      | Python FastAPI + SQLAlchemy   |
| Database         | PostgreSQL (via Docker + pgAdmin) |
| Containerization | Docker + Docker Compose       |

---

## 📦 Project Structure

- PersonalFinanceProject 
- - ├── finance-dashboard-webapp/ # React frontend 
- - ├── finance-api-proxy/ # Node.js proxy server 
- - ├── finance-api-backend/ # FastAPI backend 
- - ├── docker-compose.yml 
- - ├── .env # Global environment variables 
- - └── README.md


---

## 🗃️ Database Schema & Relationships

### 1. Users Table

| Field      | Type      | Description         |
|------------|-----------|---------------------|
| user_id    | UUID (PK) | Unique user ID      |
| name       | String    | User's name         |
| email      | String    | User email (unique) |
| password   | String    | Hashed password     |

---

### 2. Transactions Table

| Field           | Type      | Description                    |
|-----------------|-----------|--------------------------------|
| transaction_id  | UUID (PK) | Unique transaction ID          |
| user_id         | UUID (FK) | Linked to Users table          |
| type            | String    | income / expense               |
| category        | String    | Category of transaction        |
| amount          | Float     | Transaction amount             |
| created_at      | DateTime  | Timestamp when created         |

**Relation:** One-to-Many → **User → Transactions**

---

### 3. AssetsAndLiability Table

| Field           | Type      | Description                    |
|-----------------|-----------|--------------------------------|
| assetliab_id    | UUID (PK) | Unique asset/liability ID      |
| user_id         | UUID (FK) | Linked to Users table          |
| name            | String    | Name of asset/liability        |
| type            | String    | asset / liability              |
| value           | Float     | Value                          |
| created_at      | DateTime  | Timestamp when created         |

**Relation:** One-to-Many → **User → AssetsAndLiabilities**

---

## 🔐 Security Implementations

### 1. SQL Injection Protection
- ✅ Used **SQLAlchemy ORM** exclusively, avoiding raw SQL.
- ✅ All database CRUD interactions are **parameterized** via `.filter()` and `.query()` methods.

### 2. XSS Protection
- ✅ Frontend (ReactJS) **escapes all dynamic content** by default.
- ✅ Avoided usage of `dangerouslySetInnerHTML`.
- ✅ User inputs are **validated and sanitized** before rendering.

### 3. CSRF Protection
- ✅ Using **JWT in Authorization headers** (not cookies), mitigating CSRF risks.


### 4. Additional Security Layers
- ✅ **CORS enabled** in both proxy and backend with whitelisted origins.
- ✅ **Helmet.js middleware** added in Node.js proxy for secure HTTP headers.

---

## ⚙️ Deployment & Env Setup

### Global `.env` File (Located in root folder)
### Steps to Run app locally
- Clone the repo
- Make sure docker is installed on the system.
- Run 'docker-compose up -d'
- Open port 'localhost:3000'

***
### Each Service's Functionality is provided in repo's personal readme File
