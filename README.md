# Notes App — FastAPI + Next.js

A full-stack note-taking application. Python API on the back, Next.js 14 App Router on the front, JWT auth joining the two.

## What it does

- **Write and organise notes** — rich editor, tag any note, archive what you're done with
- **Search and filter** — find notes by content or tag from the sidebar
- **Accounts** — register / log in, with each user seeing only their own notes
- **Themes** — light and dark, persisted per user

## Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, SQLModel, Pydantic, python-jose (JWT), passlib (bcrypt) |
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Database | SQL via SQLModel |

## Layout

```
backend/
  app/
    routers/      # auth, notes, tags, health endpoints
    models.py     # SQLModel tables
    auth.py       # JWT issue + verify
    database.py   # session/engine setup
    dependencies.py
  main.py         # FastAPI app entrypoint
frontend/
  app/            # Next.js App Router pages
  components/     # Editor, Sidebar, ArchiveView, SettingsView, Login
    ui/           # shadcn/ui primitives
```

## Running it locally

**Backend**

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API docs are then served at `http://localhost:8000/docs`.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## API surface

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/auth/register` | Create an account |
| `POST` | `/auth/login` | Exchange credentials for a JWT |
| `GET/POST` | `/notes` | List or create notes |
| `PUT/DELETE` | `/notes/{id}` | Update or remove a note |
| `GET/POST` | `/tags` | List or create tags |
| `GET` | `/health` | Liveness probe |

Further notes on the auth design are in `AUTHENTICATION_IMPLEMENTATION.md`, and environment setup in `SETUP_INSTRUCTIONS.md`.
