# Active8 - College Sponsorship Marketplace

## Backend Setup

### Prerequisites
- Node.js v18+
- MongoDB running locally on `mongodb://localhost:27017`

### Installation

```bash
cd backend
npm install
```

### Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

---

## Frontend Setup

### Prerequisites
- Node.js v18+

### Installation

```bash
cd frontend
npm install
```

### Run Development Server

```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

---

## Architecture

### Backend
- **Node.js + Express.js**: REST API server
- **MongoDB + Mongoose**: Database
- **JWT (httpOnly cookies)**: Authentication
- **Multer**: File uploads
- **OOP Pattern**: BaseRepository → Services → Controllers

### Frontend
- **React.js + Vite**: UI framework
- **Axios**: HTTP client with credentials
- **React Router DOM**: Routing
- **Context API**: AuthContext for user state

---

## Database Setup

1. Ensure MongoDB is running
2. API will auto-create collections on first use

---

## Key Features

1. **User Roles**: student, brand, college_admin, platform_admin
2. **College Verification**: Only platform_admin can verify colleges
3. **Student Approval**: college_admin approves students of their college
4. **Event Management**: Students create and publish events with sponsorship tiers
5. **Applications**: Brands and students apply to events
6. **Chat**: Auto-enabled after application acceptance
7. **Proof Submission**: Students upload proof, brands approve
8. **Event Completion**: Event marked as completed when all proofs are approved

---

## API Routes

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Colleges
- `POST /api/colleges` - Create college (college_admin)
- `GET /api/colleges` - List colleges (platform_admin)
- `PATCH /api/colleges/:id/verify` - Verify college (platform_admin)
- `GET /api/colleges/students/pending` - Pending students (college_admin)
- `PATCH /api/colleges/students/:id/approve` - Approve student (college_admin)

### Events
- `POST /api/events` - Create event (student)
- `GET /api/events` - List events
- `GET /api/events/:id` - Get event detail
- `PATCH /api/events/:id/publish` - Publish event (student owner)
- `POST /api/events/:id/tiers` - Add tier (student owner)
- `GET /api/events/:id/tiers` - Get tiers

### Applications
- `POST /api/applications` - Create application (student/brand)
- `GET /api/applications/mine` - My applications (student/brand)
- `PATCH /api/applications/:id/respond` - Respond to application

### Conversations
- `GET /api/conversations/:applicationId` - Get conversation
- `POST /api/conversations/:id/messages` - Send message
- `GET /api/conversations/:id/messages` - Get messages

### Proofs
- `POST /api/proofs` - Upload proof (student, multipart)
- `GET /api/proofs/event/:eventId` - Get proofs (brand)
- `PATCH /api/proofs/:id/approve` - Approve proof (brand)

---

## Testing Flow

### 1. Setup Platform Admin
```
1. POST /api/auth/register with role='platform_admin'
   → Automatically active
```

### 2. Create College
```
1. POST /api/auth/register with role='college_admin', collegeDomain='' (empty)
   → Status = pending
2. Platform admin: PATCH /api/colleges/{collegeId}/verify
   → College verified, college_admin activated
```

### 3. Student Registration & Approval
```
1. POST /api/auth/register with role='student', collegeDomain='yourschool.edu'
   → Status = pending
2. College admin: GET /api/colleges/students/pending
3. College admin: PATCH /api/colleges/students/{studentId}/approve
   → Student activated
```

### 4. Brand Registration
```
1. POST /api/auth/register with role='brand'
   → Automatically active
```

### 5. Event Flow
```
1. Student: POST /api/events (create event in draft)
2. Student: POST /api/events/{id}/tiers (add sponsorship tiers)
3. Student: PATCH /api/events/{id}/publish (publish event)
4. Brand: GET /api/events (see published events)
5. Brand: POST /api/applications (apply)
6. Student: GET /api/applications/mine (see brand application)
7. Student: PATCH /api/applications/{id}/respond with status='accepted'
   → Conversation auto-created
8. Both: Chat on conversation
```

### 6. Proof Flow
```
1. Student: POST /api/proofs with file upload
2. Brand: GET /api/proofs/event/{eventId} (review)
3. Brand: PATCH /api/proofs/{id}/approve (approve)
   → When all proofs approved, event.status = 'completed'
```

---

## Code Quality Highlights

✅ **No try/catch** in controllers (express-async-errors)
✅ **No model imports** in services (repository pattern)
✅ **No business logic** in controllers or routes
✅ **Repository Pattern** - All DB access through repositories
✅ **Singleton Pattern** - One instance per repository
✅ **OOP Inheritance** - All repositories extend BaseRepository
✅ **Polymorphism** - authorize middleware works for any role combination
✅ **Complete CRUD** - BaseRepository handles findById, findOne, find, create, update, delete

