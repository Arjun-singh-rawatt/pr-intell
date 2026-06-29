# PR Intel — Setup (keys only)

Everything else is implemented. You only need API keys in `backend/.env`.

## 1. Install

```powershell
cd d:\ARJUN_code\pr-intel
npm install
npm run install:all
```

## 2. Environment

```powershell
cd backend
copy .env.example .env
notepad .env
```

| Variable | Required? | Purpose |
|----------|-----------|---------|
| `GITHUB_TOKEN` | Recommended | Higher GitHub rate limits (feed + search) |
| `GEMINI_API_KEY` | For AI | Free — [get key](https://aistudio.google.com/app/apikey) |
| `ANTHROPIC_API_KEY` | Optional | Extra AI provider in rotation |
| `OPENAI_API_KEY` | Optional | Extra AI provider |
| `GROK_API_KEY` | Optional | Extra AI provider |
| `DEEPSEEK_API_KEY` | Optional | Extra AI provider |
| Ollama | Optional | Local fallback if cloud keys exhausted |

Leave unused keys **empty**. Do not paste example placeholders like `ghp_xxxx`.

## 3. Run

```powershell
# From project root (both servers)
npm run dev
```

- Frontend: http://localhost:3001  
- Backend: http://localhost:5000  

Or two terminals:

```powershell
cd backend; npm run dev
cd frontend; npm run dev
```

## 4. Verify

- http://localhost:5000/api/health  
- http://localhost:5000/api/prs?page=1  
- Open app → Contributor Feed loads PRs  
- Open a PR → **Explain with AI** (needs `GEMINI_API_KEY` or another AI key)  
- Settings → Save Changes (persists to `backend/data/store.json`)  
- Save a PR / KB doc / contributor (same store file)

## Data files (auto-created)

- `backend/data/store.json` — settings + bookmarks (gitignored)  
- `backend/data/kb-documents.json` — Rocket.Chat doc index (committed)

## Troubleshooting

**Bad credentials (GitHub)** — Remove invalid `GITHUB_TOKEN` or set a real token.

**AI errors** — Add `GEMINI_API_KEY` or run [Ollama](https://ollama.com) locally.

**Port in use** — Stop the old process on 5000 or change `PORT` in `.env`.
