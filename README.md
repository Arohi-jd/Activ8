# Active8 — Events & Sponsorship Platform activ8-ashen.vercel.app

Active8 is a role-based college sponsorship marketplace where students create sponsorship-ready events, brands apply to sponsor them, and college/platform admins manage trust and approvals.

## How Active8 Works

1. **Platform Admin** onboards and verifies colleges.  
2. **College Admin** approves students from verified college domains.  
3. **Student** creates an event, defines sponsorship tiers, and publishes it.  
4. **Brand** discovers published events and submits sponsorship applications.  
5. After acceptance, both sides get a conversation channel for coordination.  
6. **Student** uploads proof of delivery, and **Brand** approves it.  
7. Once all required proofs are approved, the event is marked complete.

---

## Dashboard Screens

### Platform Admin Dashboard
<img src="https://github.com/user-attachments/assets/e4b46a44-ad49-4863-b17a-3792d5cd39e0" alt="Platform Admin Dashboard" />

### Student Dashboard
<img src="https://github.com/user-attachments/assets/ffbb98ad-e2bd-44f9-961c-9c60b96df9b7" alt="Student Dashboard" />

### College Admin Dashboard
<img src="https://github.com/user-attachments/assets/2ceeb478-ed62-4692-9852-0ffd4e2b3af4" alt="College Admin Dashboard" />

### Brand Dashboard
<img src="https://github.com/user-attachments/assets/666e3500-cd86-4852-b9f8-48402e37a1f4" alt="Brand Dashboard" />

---

## Core Features

- Role-based access: `student`, `brand`, `college_admin`, `platform_admin`
- College verification workflow
- Student approval workflow
- Event creation and publishing by students
- Sponsorship tiers per event
- Brand ↔ Student application and acceptance flow
- Auto-created conversations after accepted applications
- Proof upload and approval flow
- Event auto-completion after proof approvals

---

## Tech Stack

### Frontend
- React + Vite
- React Router DOM
- Axios
- Context API (authentication state)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT auth with httpOnly cookies
- Multer for uploads
- Repository-service-controller architecture

---

## Project Structure

```text
Activ8/
├── backend/    # Express API
├── frontend/   # React client
└── README.md
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB running locally

### 1) Backend Setup

```bash
cd backend
npm install
```

Create `.env` in `backend/` with:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/active8
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

### 2) Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` in `frontend/` with:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## API Overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Colleges
- `POST /api/colleges`
- `GET /api/colleges`
- `PATCH /api/colleges/:id/verify`
- `GET /api/colleges/students/pending`
- `PATCH /api/colleges/students/:id/approve`

### Events
- `POST /api/events`
- `GET /api/events`
- `GET /api/events/:id`
- `PATCH /api/events/:id/publish`
- `POST /api/events/:id/tiers`
- `GET /api/events/:id/tiers`

### Applications
- `POST /api/applications`
- `GET /api/applications/mine`
- `PATCH /api/applications/:id/respond`

### Conversations
- `GET /api/conversations/:applicationId`
- `POST /api/conversations/:id/messages`
- `GET /api/conversations/:id/messages`

### Proofs
- `POST /api/proofs`
- `GET /api/proofs/event/:eventId`
- `PATCH /api/proofs/:id/approve`

---

## Demo Flow (Recommended)

1. Register platform admin  
2. Register college admin and verify college  
3. Register student and approve from college admin dashboard  
4. Register brand  
5. Student creates and publishes event with tiers  
6. Brand applies to sponsor  
7. Student accepts application  
8. Both users chat and coordinate  
9. Student uploads proof, brand approves, event completes

---

## Scripts

### Backend (`backend/package.json`)
- `npm run dev` — start backend with nodemon
- `npm start` — start backend with node
- `npm run seed` — run seed script

### Frontend (`frontend/package.json`)
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build
