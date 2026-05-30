# CentraSpend — Expense Tracker

Full-stack expense tracker (React + Express + MongoDB).

## Prerequisites

- **Node.js** 18+
- **MongoDB** running locally (`mongod`), **or** a MongoDB Atlas cluster with your IP whitelisted

Check MongoDB:

```bash
systemctl status mongod   # Linux
# or: mongosh --eval "db.runCommand({ ping: 1 })"
```

## Quick start (recommended)

From the project root:

```bash
# 1. Install dependencies (root + client + server)
npm install
npm install --prefix client
npm install --prefix server

# 2. Configure the database (local MongoDB)
cp server/.env.example server/.env
# Edit server/.env — for local dev, keep:
#   USE_LOCAL_MONGO=true
#   MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker

# 3. Run API + frontend together
npm run dev
```

- **Frontend:** http://localhost:5173 (Vite default)
- **API:** http://localhost:5000
- **Health check:** http://localhost:5000/api/health

## Run servers separately

**Terminal 1 — API**

```bash
cd server
npm install
npm run dev
```

**Terminal 2 — UI**

```bash
cd client
npm install
npm run dev
```

## First use

1. Open http://localhost:5173
2. **Create account** (register) or sign in
3. Set your **default currency** in the navbar (optional)
4. Add expenses — pick any of **162 ISO currencies** per transaction

## Currencies

- Full list is served from `GET /api/currencies` (generated from the ISO 4217 set).
- Each expense stores its own `currency` code.
- Navbar default applies to **new** expenses; change per expense in the add form.

## Fixing database connection issues

| Symptom | Fix |
|--------|-----|
| Atlas timeout / IP not whitelisted | Set `USE_LOCAL_MONGO=true` in `server/.env` and use local `mongod` |
| `mongod` not running | `sudo systemctl start mongod` |
| UI shows connection error | Ensure server is on port **5000** (`npm run server`) |
| 401 / session errors | Sign out and register or log in again |

The server automatically **falls back to local MongoDB** if Atlas is configured but unreachable.

## Scripts (root `package.json`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Client + server concurrently |
| `npm run client` | Vite dev server only |
| `npm run server` | Express API only |
