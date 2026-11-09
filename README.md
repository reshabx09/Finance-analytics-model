# FinSight — Finance Analytics & Cash Flow Manager

A full-stack MERN financial tracking and analytics application.

## Features
- **User Authentication:** Signup/login/logout with email OTP verification, bcrypt password hashing, and JWT security.
- **Categorized Transaction Management:** Manual category selection for transactions (`Necessities`, `Luxuries`, `Assets`, `Investment`, `Savings`, `Income / Salary`, `Others`).
- **Real-Time Financial Dashboard:** Instant calculations for Total Credit, Total Debit, Net Balance, and custom balance overrides.
- **Visual Analytics:** Interactive Recharts Donut & Bar charts analyzing category spending distribution and cash flow comparisons.
- **MongoDB Persistence:** Stored in MongoDB with offline-first `localStorage` resilience.

## Run
### 1. MongoDB
Run MongoDB locally, or copy `backend/.env.example` to `backend/.env` and set `DB_URL`, `AUTH_SECRET`, `SENDER_EMAIL`, and `SENDER_PASSWORD`.

### 2. Backend
```bash
cd backend
npm install
npm run dev
```
Runs on `http://localhost:3030`.

### 3. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Runs on `http://localhost:5173`.