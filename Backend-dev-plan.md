# Backend Development Plan: QuickNote

### 1️⃣ Executive Summary
- This document outlines the backend development plan for QuickNote, a distraction-free, tag-based note-taking web application.
- The backend will be built using Python 3.13 with the FastAPI framework and will use MongoDB Atlas as the database via the Motor async driver.
- Development will follow a dynamic sprint plan (S0...Sn) to cover all frontend-visible features.
- Key constraints include no Docker, a single `main` branch for Git, and mandatory manual testing of each task via the frontend UI before committing.

### 2️⃣ In-Scope & Success Criteria
- **In-Scope Features:**
    - User Authentication (Signup, Login, Logout)
    - Note Management (Create, Edit, View) with Auto-Save
    - Tag-Based Organization with Autocomplete
    - Unified Search (Note Content & Tags)
    - Note List with Sorting by Last-Edited
    - Tag Management and Filtering
    - Note Archiving and Restoration
- **Success Criteria:**
    - All frontend features are fully functional end-to-end, powered by the backend.
    - Every task-level manual test passes successfully through the UI.
    - Code for each completed sprint is pushed to the `main` branch after verification.

### 3️⃣ API Design
- **Base Path:** `/api/v1`
- **Error Envelope:** All error responses will use the format `{ "error": "A descriptive error message" }`

#### Authentication Endpoints
- **`POST /api/v1/auth/signup`**
    - **Purpose:** Register a new user.
    - **Request:** `{ "name": "string", "email": "string", "password": "string" }`
    - **Response:** `{ "token": "jwt_token", "user": { "id": "string", "name": "string", "email": "string" } }`
    - **Validation:** `email` must be unique and valid. `password` must be at least 8 characters.
- **`POST /api/v1/auth/login`**
    - **Purpose:** Log in an existing user.
    - **Request:** `{ "email": "string", "password": "string" }`
    - **Response:** `{ "token": "jwt_token", "user": { "id": "string", "name": "string", "email": "string" } }`
    - **Validation:** `email` and `password` must match a user record.
- **`POST /api/v1/auth/logout`**
    - **Purpose:** Log out a user (server-side logic is minimal as JWT is client-handled).
    - **Request:** (None)
    - **Response:** `{ "message": "Logout successful" }`
- **`GET /api/v1/auth/me`**
    - **Purpose:** Get the current logged-in user's profile.
    - **Request:** (Requires Bearer Token)
    - **Response:** `{ "id": "string", "name": "string", "email": "string" }`

#### Notes Endpoints
- **`GET /api/v1/notes`**
    - **Purpose:** Get all non-archived notes for the logged-in user. Supports search and tag filtering.
    - **Query Params:** `search` (string), `tag` (string)
    - **Response:** `[{ "id": "string", "title": "string", "content": "string", "tags": ["tag1"], "isArchived": false, "createdAt": "date", "updatedAt": "date" }]`
- **`POST /api/v1/notes`**
    - **Purpose:** Create a new, empty note.
    - **Request:** (None)
    - **Response:** `{ "id": "string", "title": "", "content": "", "tags": [], "isArchived": false, "createdAt": "date", "updatedAt": "date" }`
- **`PUT /api/v1/notes/{note_id}`**
    - **Purpose:** Update a note's content (auto-save).
    - **Request:** `{ "content": "updated markdown content" }`
    - **Response:** `{ "id": "string", "title": "string", "content": "string", "tags": ["tag1"], "isArchived": false, "updatedAt": "date" }`
- **`PUT /api/v1/notes/{note_id}/archive`**
    - **Purpose:** Archive a note.
    - **Request:** (None)
    - **Response:** `{ "message": "Note archived" }`
- **`PUT /api/v1/notes/{note_id}/restore`**
    - **Purpose:** Restore a note from the archive.
    - **Request:** (None)
    - **Response:** `{ "message": "Note restored" }`
- **`DELETE /api/v1/notes/{note_id}`**
    - **Purpose:** Permanently delete a note (must be archived first).
    - **Request:** (None)
    - **Response:** `{ "message": "Note permanently deleted" }`

#### Tags Endpoint
- **`GET /api/v1/tags`**
    - **Purpose:** Get all unique tags and their usage counts for the logged-in user.
    - **Response:** `[{ "name": "tag1", "count": 5 }, { "name": "tag2", "count": 3 }]`

### 4️⃣ Data Model (MongoDB Atlas)

- **`users` collection**
    - `_id`: ObjectId (Primary Key)
    - `name`: String (required)
    - `email`: String (required, unique)
    - `password`: String (hashed, required)
    - `createdAt`: DateTime (default: now)
    - `updatedAt`: DateTime (default: now)
    - **Example Document:**
      ```json
      {
        "_id": "60c72b2f9b1d8e001f8b4567",
        "name": "Alex Doe",
        "email": "alex@example.com",
        "password": "hashed_password_string",
        "createdAt": "2023-10-27T10:00:00Z",
        "updatedAt": "2023-10-27T10:00:00Z"
      }
      ```

- **`notes` collection**
    - `_id`: ObjectId (Primary Key)
    - `userId`: ObjectId (foreign key to `users`, required)
    - `title`: String (derived from first line of content)
    - `content`: String
    - `tags`: Array of Strings
    - `isArchived`: Boolean (default: false)
    - `createdAt`: DateTime (default: now)
    - `updatedAt`: DateTime (default: now)
    - **Example Document:**
      ```json
      {
        "_id": "60c72b2f9b1d8e001f8b4568",
        "userId": "60c72b2f9b1d8e001f8b4567",
        "title": "Meeting Notes",
        "content": "# Meeting Notes\n- Discussed Q4 roadmap\n#project-alpha",
        "tags": ["project-alpha"],
        "isArchived": false,
        "createdAt": "2023-10-27T11:00:00Z",
        "updatedAt": "2023-10-27T11:05:00Z"
      }
      ```

### 5️⃣ Frontend Audit & Feature Map

- **`Login.tsx`**
    - **Purpose:** Handles user registration and login.
    - **Endpoints:** `POST /api/v1/auth/signup`, `POST /api/v1/auth/login`
    - **Models:** `User`
- **`Sidebar.tsx`**
    - **Purpose:** Displays notes list, tags, search bar, and navigation.
    - **Endpoints:** `GET /api/v1/notes`, `GET /api/v1/tags`, `POST /api/v1/notes` (for "New Note" button)
    - **Models:** `Note`, `Tag` (computed)
- **`Editor.tsx`**
    - **Purpose:** Main text editor for creating and modifying notes.
    - **Endpoints:** `PUT /api/v1/notes/{note_id}` (on content change), `PUT /api/v1/notes/{note_id}/archive`, `DELETE /api/v1/notes/{note_id}`
    - **Models:** `Note`
- **`ArchiveView.tsx`**
    - **Purpose:** Displays archived notes and allows restoration or permanent deletion.
    - **Endpoints:** `GET /api/v1/notes` (with an implied `isArchived=true` filter, though handled by frontend context), `PUT /api/v1/notes/{note_id}/restore`, `DELETE /api/v1/notes/{note_id}`
    - **Models:** `Note`

### 6️⃣ Configuration & ENV Vars
- `APP_ENV`: Environment (e.g., `development`, `production`)
- `PORT`: Server port (e.g., `8000`)
- `MONGODB_URI`: MongoDB Atlas connection string.
- `JWT_SECRET`: Secret key for signing JWT tokens.
- `JWT_EXPIRES_IN`: Token expiry time in seconds (e.g., `604800` for 7 days).
- `CORS_ORIGINS`: Comma-separated list of allowed frontend URLs.

### 7️⃣ Background Work
- No background tasks are required for the MVP. All operations are synchronous.

### 8️⃣ Integrations
- No external integrations are required for the MVP.

### 9️⃣ Testing Strategy (Manual via Frontend)
- All backend functionality will be validated exclusively through interaction with the frontend UI.
- Every task in the sprint plan includes a specific **Manual Test Step** and a **User Test Prompt**.
- After all tasks in a sprint are completed and have passed their manual tests, the code will be committed and pushed to the `main` branch.
- If any test fails, the developer must fix the issue and re-run all tests for that task before proceeding.

### 🔟 Dynamic Sprint Plan & Backlog (S0 → S2)

---

### **S0 – Environment Setup & Frontend Connection**

- **Objectives:**
    - Create a basic FastAPI application skeleton.
    - Establish a connection to the MongoDB Atlas database.
    - Implement a `/healthz` endpoint to verify DB connectivity.
    - Configure CORS to allow requests from the frontend.
    - Initialize a Git repository and make the first push to `main`.
- **User Stories:**
    - As a Developer, I want a running FastAPI server so that I can start building endpoints.
    - As a Developer, I want the backend to connect to MongoDB Atlas so that data can be persisted.
- **Tasks:**
    - **Task 1: Initialize FastAPI Project**
        - Setup project structure, install dependencies (`fastapi`, `uvicorn`, `motor`, `pydantic`, `python-dotenv`, `passlib[bcrypt]`, `python-jose[cryptography]`).
        - **Manual Test Step:** Run `uvicorn main:app --reload`. See the server start successfully.
        - **User Test Prompt:** "Start the backend server and confirm it runs without errors."
    - **Task 2: Implement MongoDB Connection & Health Check**
        - Create a database utility to connect to MongoDB Atlas using `MOTOR_URI`.
        - Create a `/api/v1/healthz` endpoint that pings the database and returns a status.
        - **Manual Test Step:** Access `http://localhost:8000/api/v1/healthz` in the browser or via curl. Expect `{ "status": "ok", "db_connection": "successful" }`.
        - **User Test Prompt:** "Access the `/healthz` endpoint and verify a successful database connection status is returned."
    - **Task 3: Configure CORS & Git**
        - Add CORS middleware to the FastAPI app, configured via `CORS_ORIGINS`.
        - Initialize git, create a `.gitignore` file, and push the initial project to a GitHub repository's `main` branch.
        - **Manual Test Step:** Run the frontend against the local backend. Check the browser console for CORS errors. There should be none.
        - **User Test Prompt:** "Run the frontend and backend together. Confirm there are no CORS errors in the browser's developer console."
- **Definition of Done:**
    - Backend runs locally and connects successfully to MongoDB Atlas.
    - The `/api/v1/healthz` endpoint returns a success status.
    - The project is on GitHub in the `main` branch.
- **Post-sprint:**
    - Commit and push all S0 changes to `main`.

---

### **S1 – Basic Auth (Signup / Login)**

- **Objectives:**
    - Implement user registration and login functionality using JWT.
    - Hash passwords securely before storing them in the database.
    - Create protected routes that require a valid JWT.
- **User Stories:**
    - As a User, I want to sign up for an account so I can save my notes.
    - As a User, I want to log in to my account so I can access my notes.
- **Tasks:**
    - **Task 1: User Model & Signup Endpoint**
        - Create the Pydantic model for a User and the `users` collection schema.
        - Implement the `POST /api/v1/auth/signup` endpoint. Hash passwords using `passlib`.
        - **Manual Test Step:** Use the frontend "Sign up" form to create a new user. Check the `users` collection in MongoDB Atlas to see the new user record with a hashed password.
        - **User Test Prompt:** "Create a new account using the signup form and verify you are logged in and redirected to the main app."
    - **Task 2: Login Endpoint & JWT Generation**
        - Implement the `POST /api/v1/auth/login` endpoint.
        - On successful login, generate a JWT containing the `userId`.
        - **Manual Test Step:** After signing up, log out, then use the "Sign in" form with the same credentials. The frontend should receive a token and redirect to the notes view.
        - **User Test Prompt:** "Log out, then log back in with the account you created. Confirm you are successfully logged in."
    - **Task 3: Implement Route Protection & `GET /me`**
        - Create a dependency that validates the JWT from the `Authorization` header.
        - Protect the main notes endpoint (`GET /api/v1/notes`) using this dependency.
        - Implement the `GET /api/v1/auth/me` endpoint to return the current user's data.
        - **Manual Test Step:** Try to access the notes list in the frontend without being logged in. The UI should redirect to the login page. After logging in, the user's name should appear in the sidebar.
        - **User Test Prompt:** "Log out and refresh the page. You should be redirected to the login screen. Log back in and confirm your name appears correctly."
- **Definition of Done:**
    - Users can successfully sign up and log in via the frontend.
    - The application properly restricts access to protected resources.
- **Post-sprint:**
    - Commit and push all S1 changes to `main`.

---

### **S2 – Core Note & Tag Functionality**

- **Objectives:**
    - Implement all CRUD operations for notes.
    - Implement dynamic tag calculation.
    - Enable search and filtering of notes.
- **User Stories:**
    - As a User, I want to create a new note so I can capture an idea.
    - As a User, I want my notes to save automatically so I don't lose my work.
    - As a User, I want to tag my notes and filter by them so I can stay organized.
    - As a User, I want to archive notes to clean up my workspace.
- **Tasks:**
    - **Task 1: Create, Fetch, and Update Notes**
        - Implement `POST /api/v1/notes` to create a new note.
        - Implement `GET /api/v1/notes` to fetch all non-archived notes for the user.
        - Implement `PUT /api/v1/notes/{note_id}` to handle auto-saving from the editor. This endpoint should also parse and update the `tags` array based on the note's content.
        - **Manual Test Step:** Log in, click "New Note". Type content into the editor. The "Saved" indicator should appear. Refresh the page; the note and its content should persist.
        - **User Test Prompt:** "Create a new note and type some text. After a brief pause, refresh the page and confirm your text is still there."
    - **Task 2: Implement Tag Endpoint & Note Filtering**
        - Implement `GET /api/v1/tags` using an aggregation pipeline on the `notes` collection to get unique tags and counts.
        - Enhance `GET /api/v1/notes` to accept `search` and `tag` query parameters to filter the results.
        - **Manual Test Step:** Create several notes with tags (e.g., `#idea`, `#meeting`). Type `#idea` in the search bar. Only notes with that tag should appear. Click a tag in the sidebar; the note list should filter accordingly.
        - **User Test Prompt:** "Create a few notes and add tags like `#work` and `#personal`. Use the search bar and click on the tags in the sidebar to ensure the note list filters correctly."
    - **Task 3: Implement Archiving, Restoration, and Deletion**
        - Implement `PUT /api/v1/notes/{note_id}/archive` to set `isArchived` to `true`.
        - Implement `PUT /api/v1/notes/{note_id}/restore` to set `isArchived` to `false`.
        - Implement `DELETE /api/v1/notes/{note_id}` to permanently delete a note.
        - **Manual Test Step:** In the editor, click the archive icon. The note should disappear from the main list. Go to the Archive view, find the note, and click "Restore". It should reappear in the main list. From the archive, permanently delete a note and confirm it is gone.
        - **User Test Prompt:** "Archive a note. Go to the archive view, restore it, and then archive it again. Finally, permanently delete it from the archive and confirm it is gone for good."
- **Definition of Done:**
    - Full note lifecycle (create, edit, search, filter, archive, restore, delete) is functional from the UI.
    - Tagging and tag-based filtering work as expected.
- **Post-sprint:**
    - Commit and push all S2 changes to `main`.