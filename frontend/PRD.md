# PRODUCT REQUIREMENTS DOCUMENT

## EXECUTIVE SUMMARY

**Product Name:** QuickNote

**Product Vision:** QuickNote is a fast, distraction-free note-taking application that helps knowledge workers, students, and busy professionals capture thoughts instantly and retrieve them effortlessly through intelligent tag-based organization. Unlike traditional note apps that rely on rigid folder hierarchies, QuickNote embraces flexible, multi-dimensional organization that mirrors how people actually think.

**Core Purpose:** Solves the universal problem of "I wrote that down somewhere but can't find it" by combining instant capture with powerful tag-based retrieval. Eliminates the friction of manual saving and complex organization systems that cause people to abandon their notes apps.

**Target Users:** Knowledge workers, students, researchers, and anyone who needs to capture and retrieve thoughts quickly throughout their day. Primary users are people who currently use scattered systems (phone notes, paper, random docs) and want a unified, searchable solution.

**Key MVP Features:**
- User Authentication - System/Configuration
- Note Creation & Editing with Auto-Save - User-Generated Content
- Tag-Based Organization - User-Generated Content
- Unified Search (Content + Tags) - System Data
- Notes List with Smart Sorting - System Data
- Tag Management & Filtering - User-Generated Content
- Archive System - User-Generated Content

**Platform:** Web application (responsive design, accessible via browser on desktop, tablet, and mobile devices)

**Complexity Assessment:** Simple
- State Management: Backend with localStorage cache for offline draft support
- External Integrations: None (reduces complexity significantly)
- Business Logic: Simple CRUD operations with text search and tag filtering

**MVP Success Criteria:**
- Users can create, edit, archive, and search notes end-to-end
- Tag-based organization works seamlessly with autocomplete
- Auto-save functions without user intervention
- Responsive design adapts properly to mobile/tablet/desktop
- Users create 20+ notes in first week with 70% tagged
- Search used by 80% of users within 3 days

---

## 1. USERS & PERSONAS

**Primary Persona:**
- **Name:** "Alex the Knowledge Worker"
- **Context:** Mid-level professional who attends 5-7 meetings daily, reads articles during commute, and has ideas throughout the day. Currently uses a mix of phone notes, email drafts, and paper sticky notes. Frustrated by inability to find old notes and time wasted organizing.
- **Goals:** Capture meeting notes and ideas instantly without breaking flow. Find specific notes from weeks ago in seconds. Organize thoughts flexibly without rigid folder structures. Access notes from any device seamlessly.
- **Pain Points:** Loses track of notes across multiple apps. Manual saving interrupts thought process. Folder-based organization feels restrictive. Search in current apps is terrible. Spends 10+ minutes weekly looking for old notes.

**Secondary Persona:**
- **Name:** "Sam the Student"
- **Context:** College student juggling 4-5 courses, research projects, and extracurriculars. Takes lecture notes, captures research ideas, and tracks assignments. Needs fast capture during lectures and easy retrieval during study sessions.
- **Goals:** Quick note-taking during fast-paced lectures. Tag notes by course and topic for exam prep. Search across all notes when writing papers.
- **Pain Points:** Can't type fast enough with manual save buttons. Folder organization doesn't work when notes span multiple courses. Finding relevant notes for essays takes forever.

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 Core MVP Features (Priority 0)

**FR-001: User Authentication**
- **Description:** Secure user registration, login, session management, and profile access
- **Entity Type:** System/Configuration
- **Operations:** Register, Login, View profile, Edit profile (email/password), Logout, Reset password
- **Key Rules:** Passwords hashed with bcrypt, JWT tokens expire after 7 days, email must be unique
- **Acceptance:** Users can register with email/password, login securely, stay logged in across sessions, and manage their account

**FR-002: Note Creation & Editing with Auto-Save**
- **Description:** Create new notes instantly and edit with automatic saving every 500ms after typing stops
- **Entity Type:** User-Generated Content
- **Operations:** Create, View, Edit, Archive (soft delete), Restore from archive, List/Search, Export
- **Key Rules:** Auto-save triggers 500ms after last keystroke, markdown formatting supported (headings, bold, italic, lists, checklists), notes belong to creating user only
- **Acceptance:** Users can create notes instantly, type continuously with auto-save working invisibly, see save status indicator, and never lose content

**FR-003: Tag-Based Organization**
- **Description:** Add/remove tags to notes using # syntax with autocomplete from existing tags
- **Entity Type:** User-Generated Content (tags embedded in notes)
- **Operations:** Add tag, Remove tag, View all tags, Filter by tag, Autocomplete suggestions
- **Key Rules:** Tags derived dynamically from notes, unused tags disappear automatically, tags case-insensitive, # prefix optional in UI
- **Acceptance:** Users can add tags with autocomplete, remove tags easily, see all their tags, and filter notes by clicking tags

**FR-004: Unified Search**
- **Description:** Single search bar that searches note content and filters by tags simultaneously
- **Entity Type:** System Data
- **Operations:** Search by text (full-text), Filter by tag (# prefix), View results, Clear search
- **Key Rules:** Search is case-insensitive, # prefix filters by tag, plain text searches content, results update in real-time
- **Acceptance:** Users can search note content, filter by tags using #tagname, see instant results, and combine text + tag searches

**FR-005: Notes List with Smart Sorting**
- **Description:** Display all notes sorted by last-edited timestamp with preview text
- **Entity Type:** System Data
- **Operations:** View list, Sort by last-edited, Preview first 100 characters, Click to open, Show tag badges
- **Key Rules:** Default sort is updatedAt descending, archived notes hidden from main list, shows note title or first line
- **Acceptance:** Users see their most recent notes first, can quickly scan previews, and click to open any note

**FR-006: Tag Management & Filtering**
- **Description:** View all tags with note counts and filter notes by clicking tags
- **Entity Type:** User-Generated Content
- **Operations:** View tag list, See note count per tag, Click to filter, Clear filter, View filtered results
- **Key Rules:** Tags sorted by usage count descending, only shows tags with 1+ notes, clicking tag filters notes list
- **Acceptance:** Users can see all their tags, understand which tags are most used, and filter notes by clicking tags

**FR-007: Archive System**
- **Description:** Archive notes to hide from main list without permanent deletion, with restore capability
- **Entity Type:** User-Generated Content
- **Operations:** Archive note, View archived notes, Restore note, Permanently delete (from archive only)
- **Key Rules:** Archived notes hidden from main list and search, can be restored anytime, permanent delete only available in archive view
- **Acceptance:** Users can archive notes to declutter, view archived notes separately, restore archived notes, and permanently delete only when certain

---

## 3. USER WORKFLOWS

### 3.1 Primary Workflow: Capture and Retrieve a Note

**Trigger:** User has a thought or information to capture during their day
**Outcome:** User successfully captures the note with tags and retrieves it later using search

**Steps:**
1. User clicks "New Note" button or uses keyboard shortcut (Ctrl+N)
2. System creates blank note and focuses cursor in editor
3. User types content with markdown formatting, adds tags using # syntax with autocomplete suggestions
4. System auto-saves every 500ms after typing stops, showing "Saved" indicator
5. User continues working, note remains accessible in notes list sorted by last-edited
6. Later, user searches by typing keyword or #tag in search bar
7. System displays matching notes instantly, user clicks desired note to open and continue editing

### 3.2 Key Supporting Workflows

**Register Account:** User navigates to signup → enters email/password → submits → receives confirmation → redirected to main app

**Login:** User enters credentials → system validates → creates session → redirects to notes list

**Create Note:** User clicks New Note → system creates blank note → user types → auto-save triggers → note appears in list

**Edit Note:** User clicks note from list → opens in editor → modifies content/tags → auto-save updates → changes reflected immediately

**Add Tags:** User types # in editor → autocomplete shows existing tags → user selects or creates new → tag added to note

**Search Notes:** User types in search bar → system filters results in real-time → user sees matching notes → clicks to open

**Filter by Tag:** User clicks tag from tag list or note → notes list filters to show only notes with that tag → user clicks to clear filter

**Archive Note:** User clicks archive button on note → note removed from main list → moved to archive view → can be restored anytime

**Restore Note:** User opens archive view → clicks restore on archived note → note returns to main list with original timestamp

---

## 4. BUSINESS RULES

### 4.1 Entity Lifecycle Rules

| Entity | Type | Who Creates | Who Edits | Who Deletes | Delete Action |
|--------|------|-------------|-----------|-------------|---------------|
| User | System/Configuration | Self (registration) | Self | Self | Hard delete (account + all notes) |
| Note | User-Generated | Owner | Owner | Owner | Soft delete (archive) then hard delete |
| Tag | User-Generated | Auto-created | N/A | Auto-removed | Removed when no notes use it |
| Session | System | System (login) | N/A | System/User | Hard delete (logout/expire) |

### 4.2 Data Validation Rules

| Entity | Required Fields | Key Constraints |
|--------|-----------------|-----------------|
| User | email, password | Email valid format and unique, password min 8 chars |
| Note | ownerId, content | Content max 50,000 chars, title derived from first line |
| Tag | name | Name 1-30 chars, alphanumeric + hyphens, case-insensitive |
| Session | userId, token | Token expires after 7 days, one active session per device |

### 4.3 Access & Process Rules
- Users can only view, edit, and archive their own notes (strict ownership)
- Auto-save triggers 500ms after last keystroke to balance performance and data safety
- Archived notes excluded from main list and search but remain in database
- Tags automatically created when first used and removed when no notes reference them
- Search results limited to 100 notes maximum for performance
- Free users limited to 1,000 active notes (archived notes don't count toward limit)
- Markdown rendering happens client-side for performance
- Session tokens stored in httpOnly cookies for security

---

## 5. DATA REQUIREMENTS

### 5.1 Core Entities

**User**
- **Type:** System/Configuration | **Storage:** Backend (MongoDB)
- **Key Fields:** id, email (unique), passwordHash, name, createdAt, updatedAt, preferences (theme, defaultView)
- **Relationships:** has many Notes
- **Lifecycle:** Full CRUD with account deletion (cascades to all notes), password reset, profile export

**Note**
- **Type:** User-Generated Content | **Storage:** Backend (MongoDB) with localStorage draft cache
- **Key Fields:** id, ownerId, title (derived), content (markdown), tags (array), isArchived (boolean), createdAt, updatedAt
- **Relationships:** belongs to User
- **Lifecycle:** Create, View, Edit, Archive (soft delete), Restore, Permanent Delete (from archive), Export, List/Search

**Tag**
- **Type:** User-Generated Content | **Storage:** Derived dynamically from Note.tags arrays
- **Key Fields:** name (normalized lowercase), noteCount (computed), lastUsed (computed)
- **Relationships:** embedded in Notes (many-to-many via array)
- **Lifecycle:** Auto-created on first use, auto-removed when noteCount reaches 0, View/Filter only

**Session**
- **Type:** System Data | **Storage:** Backend (JWT tokens) + httpOnly cookies
- **Key Fields:** userId, token (JWT), expiresAt, createdAt, deviceInfo
- **Relationships:** belongs to User
- **Lifecycle:** Created on login, validated on requests, expired after 7 days, deleted on logout

### 5.2 Data Storage Strategy
- **Primary Storage:** Backend MongoDB database for all persistent data
- **Cache Layer:** localStorage for draft notes (auto-save buffer before backend sync)
- **Capacity:** MongoDB handles unlimited notes per user (soft limit 1,000 active for MVP)
- **Persistence:** All data persists across sessions and devices via backend sync
- **Audit Fields:** All entities include createdAt, updatedAt, createdBy (userId), updatedBy (userId)
- **Backup:** User can export all notes as JSON or Markdown files

---

## 6. INTEGRATION REQUIREMENTS

No external integrations required for MVP. All functionality is self-contained within the QuickNote application, which reduces complexity and eliminates third-party dependencies.

---

## 7. VIEWS & NAVIGATION

### 7.1 Primary Views

**Login/Register Page** (`/login`, `/register`) - Email/password forms with validation, password reset link, toggle between login and register

**Main Notes Interface** (`/notes`) - Two-pane layout: left sidebar with search bar, tag list, and notes list; right pane with note editor and formatting toolbar

**Archive View** (`/archive`) - Similar to main interface but shows archived notes with restore and permanent delete actions

**Settings** (`/settings`) - User profile (email, password change), preferences (theme, default view), data export (JSON/Markdown), account deletion

**Tag Filter View** (`/notes?tag=tagname`) - Main interface filtered to show only notes with selected tag, with clear filter button

### 7.2 Navigation Structure

**Main Nav:** QuickNote logo (home) | New Note button | Search bar | Tag list toggle | Archive link | Settings icon | User menu (profile, logout)

**Default Landing:** Main notes interface (`/notes`) after login, login page (`/login`) when not authenticated

**Mobile:** Single-pane view with hamburger menu, notes list as default, full-screen editor when note selected, back button to return to list

---

## 8. MVP SCOPE & CONSTRAINTS

### 8.1 MVP Success Definition

The MVP is successful when:
- ✅ Users complete full note lifecycle: create, edit, tag, search, archive, restore
- ✅ Auto-save works invisibly without user intervention or data loss
- ✅ Tag-based organization with autocomplete functions smoothly
- ✅ Search returns accurate results for both content and tags
- ✅ Responsive design works on mobile, tablet, and desktop
- ✅ Users create 20+ notes in first week with 70% tagged
- ✅ 80% of users use search within first 3 days
- ✅ Users return 5+ times per week

### 8.2 In Scope for MVP

Core features included:
- FR-001: User Authentication (register, login, profile, logout)
- FR-002: Note Creation & Editing with Auto-Save
- FR-003: Tag-Based Organization with autocomplete
- FR-004: Unified Search (content + tags)
- FR-005: Notes List with Smart Sorting
- FR-006: Tag Management & Filtering
- FR-007: Archive System (soft delete + restore)

Additional MVP capabilities:
- Markdown formatting (headings, bold, italic, lists, checklists)
- Responsive design for mobile/tablet/desktop
- Data export (JSON and Markdown formats)
- Password reset functionality
- Session persistence across browser sessions
- Real-time auto-save with status indicator

### 8.3 Technical Constraints

- **Data Storage:** Backend MongoDB database with localStorage cache for drafts
- **Concurrent Users:** Designed for 1,000+ concurrent users with horizontal scaling capability
- **Performance:** Page loads <2s, search results <500ms, auto-save <200ms, editor interactions instant
- **Browser Support:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile:** Responsive design with single-pane navigation, iOS Safari and Android Chrome support
- **Offline:** Draft notes cached in localStorage, sync on reconnection (basic offline support)
- **Data Limits:** 1,000 active notes per free user, 50,000 characters per note, 30 characters per tag

### 8.4 Known Limitations

**For MVP:**
- No real-time collaboration or note sharing between users
- No rich media embedding (images, videos, files) - text and markdown only
- No note versioning or edit history tracking
- No AI-powered suggestions or smart tagging
- No mobile native apps - web-only via browser
- No advanced formatting (tables, code syntax highlighting, LaTeX)
- No note templates or quick-capture widgets
- No calendar integration or reminder system
- Basic offline support only (draft cache, not full offline mode)

**Future Enhancements:**
- V2 will add note sharing, collaboration, and team workspaces
- V3 will introduce AI-powered tag suggestions and smart search
- V4 will add rich media support and advanced formatting
- Mobile native apps planned for V5 based on user demand

---

## 9. ASSUMPTIONS & DECISIONS

### 9.1 Platform Decisions
- **Type:** Full-stack web application (React frontend + Node.js/Express backend)
- **Storage:** Backend MongoDB database for persistence + localStorage for draft caching
- **Auth:** JWT-based authentication with httpOnly cookies for security
- **Deployment:** Cloud-hosted (AWS/Vercel) for scalability and reliability

### 9.2 Entity Lifecycle Decisions

**User:** Full CRUD with account deletion
- **Reason:** Users need complete control over their account and data, including permanent deletion for privacy compliance

**Note:** Full CRUD + Archive (soft delete) + Restore + Export
- **Reason:** User-generated content requires full lifecycle management with safety net (archive) to prevent accidental data loss

**Tag:** Auto-created, auto-removed (no manual CRUD)
- **Reason:** Simplifies UX by eliminating tag management overhead; tags are organizational metadata, not primary content

**Session:** System-managed (create on login, expire after 7 days)
- **Reason:** Security best practice to limit session lifetime while balancing user convenience

### 9.3 Key Assumptions

1. **Users prefer archive over permanent delete for notes**
   - Reasoning: Based on product idea emphasizing "archive-first approach" to prevent accidental data loss and improve UX. Most users rarely want permanent deletion and appreciate safety nets.

2. **Markdown formatting is sufficient for MVP note-taking needs**
   - Reasoning: Product idea specified "markdown-based formatting including headings, bold/italic, lists, and checklists" as covering "most real-world note-taking needs" while keeping editor lightweight.

3. **Tag-based organization is more valuable than folder hierarchies**
   - Reasoning: Core value proposition is "flexible multi-category organization" that "mirrors how people actually think" - tags enable this better than rigid folders.

4. **Auto-save every 500ms balances performance and data safety**
   - Reasoning: Product idea specified "debounced auto-save (500ms)" as optimal for "fast note capture" without "friction of manual saving" while avoiding excessive server requests.

5. **Single-pane mobile navigation is more intuitive than split-pane**
   - Reasoning: Clarification answer confirmed "single-pane navigation where users move from notes list to full-screen editor" as "focused, familiar, and easy to implement."

6. **Users will adopt tagging if autocomplete reduces friction**
   - Reasoning: Success metric targets "70% of notes have at least one tag" - autocomplete from existing tags makes tagging fast enough to achieve this adoption rate.

### 9.4 Clarification Q&A Summary

**Q:** What text formatting capabilities do you need for the MVP?
**A:** Markdown-based formatting including headings, bold/italic text, bullet and numbered lists, and optional checklists.
**Decision:** Implemented markdown editor with specified formatting options, keeping editor lightweight while covering real-world needs.

**Q:** Should users be able to permanently delete notes in the MVP, or would you prefer an 'Archive' feature?
**A:** Archive-first approach instead of permanent deletion to prevent accidental data loss and simplify recovery.
**Decision:** Implemented soft delete (archive) as primary deletion method, with permanent delete only available from archive view after explicit user confirmation.

**Q:** How should the system handle tags that are no longer used on any notes?
**A:** Tags are derived dynamically from notes and automatically removed when no longer used by any note.
**Decision:** Tags stored as arrays within notes, computed dynamically for tag list view, no manual cleanup required - simplifies data model and UX.

**Q:** For mobile view, how would you like navigation between notes list and editor to function?
**A:** Single-pane navigation where users move from notes list to full-screen editor and back.
**Decision:** Implemented mobile-first responsive design with single-pane view, notes list as default, full-screen editor on selection, back button to return - familiar pattern that's easy to implement.

---

**PRD Complete - Ready for Development**