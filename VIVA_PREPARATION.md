# Viva Preparation

**Short explanation:** A web app where students add expenses, set a monthly budget and see charts. React shows the screens, Express provides a REST API, MongoDB stores the data.

**Problem & usefulness:** Students lose track of small spends. The app shows where money goes and warns before the budget runs out.

## Technologies and roles
- React: builds the user interface. Recharts: charts. Lucide: icons. React Router: page navigation.
- Node.js runs JavaScript on the server; Express handles HTTP requests (routes).
- MongoDB stores data as documents; Mongoose defines schemas and validates data.

## Frontend ↔ backend
React calls `fetch()` (in `api.js`) with a URL like `/api/expenses`. Express runs the matching route, uses Mongoose to read/write MongoDB, and replies with JSON. React then updates the screen.

**REST API:** URLs represent resources and HTTP methods say the action: GET read, POST create, PUT update, DELETE remove.

**CRUD here:** Create = POST /api/expenses · Read = GET · Update = PUT /api/expenses/:id · Delete = DELETE /api/expenses/:id.

**Totals:** `/api/expenses/stats` uses a MongoDB aggregation: filter expenses to the month, then `$sum` the amounts and `$group` by category. Pages reload this data whenever opened, so changes show immediately.

**Budgets:** One Budget document per year+month. Remaining = budget − total spent. Progress % = spent ÷ budget; warning at 80%, red alert at 100%+.

## 10 likely questions
1. **Why MERN?** One language (JavaScript) across the stack.
2. **What is Mongoose?** A library that gives MongoDB schemas and validation.
3. **Why validate on the backend too?** Frontend checks can be bypassed.
4. **What is CORS?** A browser rule; the server allows our React origin.
5. **What are .env files for?** Keep secrets/config out of code.
6. **How is an invalid ID handled?** `isValidObjectId` returns 400.
7. **How do you edit an expense?** Load it with GET /:id, fill the form, send PUT.
8. **Why not localStorage?** Requirement is a real database; it is shared and persistent.
9. **What are the limitations?** No login, no automated tests.
10. **How are demo records separated?** `isSample: true`, shown with a "Sample" tag and removable via `npm run seed:clear`.

## Demo sequence
1. Run `npm run seed`; show Dashboard. 2. Set a budget on the Budget page. 3. Add an expense; return to Dashboard to see totals change. 4. Search/filter/sort in Expenses. 5. Edit, then delete (confirmation). 6. Show Analytics. 7. Refresh the browser to show persistence.
