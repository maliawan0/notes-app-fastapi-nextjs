# QuickNote Backend Setup Instructions

## ✅ S0 - Environment Setup Complete

The backend structure has been created with:
- FastAPI application skeleton
- MongoDB Atlas connection setup
- Health check endpoint (`/api/v1/healthz`)
- CORS configuration
- Environment files for both frontend and backend

## 🚀 Quick Start

### 1. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Environment variables are already set up:**
   - `backend/.env` - Contains MongoDB connection string and configuration
   - The MongoDB URI is already configured with your credentials

6. **Start the backend server:**
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload
   ```

   The server will start on `http://localhost:8000`

### 2. Frontend Setup

1. **Environment variables are already set up:**
   - `frontend/.env.local` - Contains API URL pointing to backend

2. **Start the frontend (if not already running):**
   ```bash
   cd frontend
   npm install  # If not already done
   npm run dev
   ```

   The frontend will start on `http://localhost:3000`

## 🧪 Testing S0

### Test 1: Health Check Endpoint
1. Start the backend server
2. Open your browser or use curl:
   ```bash
   curl http://localhost:8000/api/v1/healthz
   ```
3. Expected response:
   ```json
   {
     "status": "ok",
     "db_connection": "successful"
   }
   ```

### Test 2: CORS Configuration
1. Start both frontend and backend
2. Open browser developer console (F12)
3. Navigate to `http://localhost:3000`
4. Check for CORS errors - there should be none

### Test 3: Root Endpoint
1. Visit `http://localhost:8000/` in your browser
2. Should see:
   ```json
   {
     "message": "QuickNote API",
     "version": "1.0.0"
   }
   ```

## 📁 Project Structure

```
Notes-Taker-Appp/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py          # MongoDB connection
│   │   └── routers/
│   │       ├── health.py        # Health check endpoint ✅
│   │       ├── auth.py          # Auth endpoints (S1 - pending)
│   │       ├── notes.py         # Notes endpoints (S2 - pending)
│   │       └── tags.py          # Tags endpoints (S2 - pending)
│   ├── main.py                  # FastAPI app entry point
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variables (created)
│   └── README.md                # Backend documentation
├── frontend/
│   ├── .env.local               # Frontend environment (created)
│   └── ...
└── Backend-dev-plan.md          # Development plan
```

## 🔐 Environment Variables

### Backend (.env)
- `APP_ENV`: Environment (development/production)
- `PORT`: Server port (default: 8000)
- `MONGODB_URI`: MongoDB Atlas connection string (already configured)
- `JWT_SECRET`: Secret key for JWT tokens (change in production!)
- `JWT_EXPIRES_IN`: Token expiry in seconds (604800 = 7 days)
- `CORS_ORIGINS`: Allowed frontend URLs (comma-separated)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Backend API base URL

## ✅ S0 Definition of Done Checklist

- [x] Backend runs locally and connects successfully to MongoDB Atlas
- [x] The `/api/v1/healthz` endpoint returns a success status
- [x] CORS is configured and working
- [x] Environment files are set up
- [ ] Project is on GitHub in the `main` branch (if needed)

## 🎯 Next Steps: S1 - Basic Auth

Once S0 is verified working, proceed to implement:
- User signup endpoint
- User login endpoint with JWT
- Protected routes middleware
- User profile endpoint

See `Backend-dev-plan.md` for detailed S1 tasks.

