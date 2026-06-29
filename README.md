2# PR Intel — Rocket.Chat PR Tracker + AI Explainer
Understand every merged PR in Rocket.Chat using GitHub API + Claude AI.
---

## What it does

- Lists all merged PRs from `RocketChat/Rocket.Chat`
- Click any PR to see files changed, author, description
- Hit **Explain with AI** → Claude explains the PR in plain English:
  - What changed and why
  - What problem it solved
  - What you should learn from it
  - How to contribute something similar

---

## Tech Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | React 18 + Vite + Tailwind CSS|
| Backend  | Node.js + Express             |
| GitHub   | GitHub REST API v3            |
| AI       | Anthropic Claude API          |

---
## Windows Setup (step by step)

### Step 1 — Get your API keys

**GitHub Token** (free, needed for higher rate limits):
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name like `pr-intel`
4. Check the `public_repo` scope
5. Copy the token

**Anthropic API Key** (needed for AI summaries):
1. Go to https://console.anthropic.com
2. API Keys → Create Key
3. Copy the key

---

### Step 2 — Open Windows Terminal (PowerShell)

```powershell
# Navigate to the project folder (change path to wherever you saved it)
cd C:\Users\YourName\projects\pr-intel

# ---- BACKEND SETUP ----
cd backend
npm install

# Create your .env file
copy .env.example .env
notepad .env
# → Replace the placeholder values with your real keys, Save and close
```

Your `.env` should look like:
```
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx
PORT=5000
```

```powershell
# Start the backend
npm run dev
# You should see: 🚀 PR Intel backend → http://localhost:5000
```
---

### Step 3 — Open a SECOND terminal tab

```powershell
# In the new tab, navigate to frontend
cd C:\Users\YourName\projects\pr-intel\frontend

npm install
npm run dev
# You should see: Local: http://localhost:3001
```

---

### Step 4 — Open the app

Go to **http://localhost:3001** in your browser.

**One command (from project root):**
```powershell
npm install
npm run install:all
npm run dev
```

---

## Project Structure

```
pr-intel/
├── backend/
│   ├── src/
│   │   ├── index.js          ← Express server entry
│   │   ├── routes/
│   │   │   └── prs.js        ← API endpoints
│   │   └── services/
│   │       ├── github.js     ← GitHub API calls
│   │       └── ai.js         ← Claude AI summarization
│   ├── .env                  ← Your secret keys (never commit this)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.jsx            ← Main app, state management
    │   └── components/
    │       ├── PRCard.jsx     ← List item card
    │       ├── PRDrawer.jsx   ← Side panel with AI summary
    │       └── SkeletonCard.jsx
    ├── index.html
    ├── vite.config.js         ← Proxy: /api → localhost:5000
    └── package.json
```

---

## API Endpoints

| Method | Endpoint                       | What it does                    |
|--------|--------------------------------|---------------------------------|
| GET    | `/api/prs?page=1`             | List merged PRs (paginated)     |
| GET    | `/api/prs/:number`            | Full PR detail + files          |
| POST   | `/api/prs/:number/summarize`  | Fetch PR + ask Claude to explain |
| GET    | `/api/health`                 | Health check                    |

---

## Troubleshooting

**"API rate limit exceeded"**
→ You haven't set a GitHub token. Edit `backend/.env` and add your token.

**"Cannot connect to backend"**
→ Make sure the backend is running (`npm run dev` in the backend folder).

**"Anthropic API error"**
→ Check your `ANTHROPIC_API_KEY` in `.env`. Make sure you have credits on console.anthropic.com.

**Port already in use**
```powershell
# Kill whatever is using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

---

## Next features to add

- [ ] Save AI summaries to MongoDB (no re-fetching)
- [ ] Filter PRs by type (bugfix / feature / refactor)
- [ ] Search PRs by keyword
- [ ] "Similar PRs" — find PRs that touched the same files
- [ ] User notes — write your own learning notes per PR
