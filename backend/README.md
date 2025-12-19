# QuickNote Backend

Backend API for QuickNote - A distraction-free note-taking application built with FastAPI and MongoDB Atlas.

## Setup

### Prerequisites
- Python 3.13
- MongoDB Atlas account and connection string

### Installation

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your MongoDB connection string and other settings
```

5. Run the server:
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload
```

The server will start on `http://localhost:8000` (or the port specified in `.env`).

## API Endpoints

### Health Check
- `GET /api/v1/healthz` - Check API and database connectivity

### Authentication (S1 - To be implemented)
- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/login` - Log in an existing user
- `POST /api/v1/auth/logout` - Log out
- `GET /api/v1/auth/me` - Get current user profile

### Notes (S2 - To be implemented)
- `GET /api/v1/notes` - Get all notes (with search and tag filtering)
- `POST /api/v1/notes` - Create a new note
- `PUT /api/v1/notes/{note_id}` - Update a note
- `PUT /api/v1/notes/{note_id}/archive` - Archive a note
- `PUT /api/v1/notes/{note_id}/restore` - Restore a note
- `DELETE /api/v1/notes/{note_id}` - Permanently delete a note

### Tags (S2 - To be implemented)
- `GET /api/v1/tags` - Get all tags with usage counts

## Development

The backend follows the sprint plan outlined in `Backend-dev-plan.md`:
- **S0**: Environment Setup & Frontend Connection ✅
- **S1**: Basic Auth (Signup / Login) - In progress
- **S2**: Core Note & Tag Functionality - Pending

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── database.py          # MongoDB connection utilities
│   └── routers/
│       ├── __init__.py
│       ├── health.py         # Health check endpoint
│       ├── auth.py           # Authentication endpoints
│       ├── notes.py          # Notes CRUD endpoints
│       └── tags.py           # Tags endpoints
├── main.py                   # FastAPI application entry point
├── requirements.txt          # Python dependencies
├── .env.example             # Environment variables template
└── README.md                # This file
```

