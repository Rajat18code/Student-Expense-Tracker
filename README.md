# Student Expense Tracker

## Abstract
A MERN-stack web app (MongoDB, Express, React, Node) that lets college students record expenses in ₹, set monthly budgets and view spending analytics. Data is stored in MongoDB and survives browser refreshes.

## Problem statement
Students on limited allowances often lose track of small daily spending. They need a simple tool to record, categorise and monitor expenses against a monthly budget.

## Objectives
- Record, view, edit and delete expenses (CRUD).
- Set a budget per month and warn when it is nearly used or exceeded.
- Show spending by category and by month using charts.

## Features
Dashboard (4 summary cards, budget bar, charts, recent transactions) · Add/Edit expense with validation · Expense list with search, category filter, date range, sorting, pagination, delete confirmation · Monthly budget with progress bar and warnings · Analytics (category chart, monthly chart, top category, average daily expense) · Demo seed data · Responsive layout with collapsible mobile menu.

## Technology stack
React (Vite), React Router, Recharts, Lucide React, plain CSS · Node.js, Express, Mongoose, cors, dotenv · MongoDB.

## System architecture
`React (browser) --fetch/JSON--> Express REST API --Mongoose--> MongoDB`
The React app never touches the database; it only calls the API in `client/src/services/api.js`.

## Database schema
**Expense**: title (String, required), amount (Number, > 0), category (enum of 7), date (Date), paymentMethod (enum: Cash/UPI/Card/Net Banking), description (String, optional), isSample (Boolean, true for demo data), createdAt/updatedAt.
**Budget**: year (Number), month (1–12), amount (Number, > 0). Unique per year+month.

## API endpoints
| Method | URL | Purpose |
|---|---|---|
| GET | /api/expenses | List (query: search, category, from, to, sort, order, page, limit) |
| GET | /api/expenses/stats?year=&month= | Totals, category and monthly data (extra helper for charts) |
| GET | /api/expenses/:id | One expense |
| POST | /api/expenses | Add (201) |
| PUT | /api/expenses/:id | Update |
| DELETE | /api/expenses/:id | Delete |
| GET | /api/budget?year=&month= | Budget (amount 0 if not set) |
| PUT | /api/budget | Create/update budget `{year, month, amount}` |

Errors: 400 invalid input or id, 404 not found, 500 server error.

## Installation
1. Install Node.js 18+ and MongoDB (local Community Server **or** a free MongoDB Atlas cluster).
2. Backend:
```
cd server
npm install
cp .env.example .env      # then edit MONGODB_URI if needed
npm run dev
```
3. Frontend (new terminal):
```
cd client
npm install
cp .env.example .env
npm run dev
```
4. Open http://localhost:5173
5. Optional demo data: `cd server && npm run seed` (remove later with `npm run seed:clear`).

## Environment configuration
`server/.env`: PORT, MONGODB_URI (local: `mongodb://127.0.0.1:27017/student-expense-tracker`; Atlas: paste your connection string), CLIENT_URL (for CORS).
`client/.env`: VITE_API_URL. Never commit `.env` files (they are in `.gitignore`).

## Testing instructions (manual)
1. `npm run seed`, open Dashboard: cards, charts and table show data.
2. Add an expense with amount 0 → error. Add a valid one → success message, form resets.
3. Edit it → change amount → dashboard total changes. Delete it → confirmation, total drops.
4. Set a budget below the current spending → red warning. Refresh the browser → data remains.
5. Try http://localhost:5001/api/expenses/abc → 400 "Invalid expense id".
6. Run `npm run seed:clear` and reload → empty states appear.

## Limitations
No login (all data is shared), no automated tests, not production-hardened, single currency (₹), budgets are per month only.

## Future enhancements
User authentication, CSV export, recurring expenses, category budgets, automated tests.

## Purpose of major files
- `server/server.js` – starts Express, connects MongoDB, registers routes.
- `server/models/` – Mongoose schemas (Expense, Budget).
- `server/routes/` – API endpoints; `server/middleware/handlers.js` – id check and error handling.
- `server/seed.js` – demo data script (marked `isSample`).
- `client/src/services/api.js` – all API calls and ₹/date formatting; `useMonth.js` – loads stats + budget.
- `client/src/pages/` – Dashboard, Expenses, ExpenseForm (add + edit), Budget, Analytics.
- `client/src/components/` – ExpenseTable, BudgetBar, Charts.
- `client/src/App.jsx` – sidebar/mobile menu and routes; `index.css` – all styling.
