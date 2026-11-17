# Feedback Collector

A full-stack feedback management application built with React, Node.js, Express, and MongoDB.

---

## Features

- **Submit Feedback** — Full Name, Email, and Message form with client- and server-side validation
- **Dashboard Overview** — Live stats: Total, Today, and This Week feedback counts
- **Feedback List** — Browse all submitted feedback, newest first
- **Search & Filter** — Case-insensitive keyword search (name, email, message) + date picker filter
- **Combined Filtering** — Both filters work simultaneously without resetting each other
- **Delete with Confirmation** — Modal dialog prevents accidental deletion
- **Persistent Storage** — All data stored in MongoDB; survives page refreshes and restarts
- **Real-time UI Updates** — Dashboard refreshes after every create or delete action
- **Loading & Empty States** — Skeleton loaders, empty-state messages
- **Toast Notifications** — Success/error feedback for every user action
- **Responsive Layout** — Works on desktop and mobile

---

## Technology Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 19, Vite, JavaScript ES6+ |
| Routing   | App-level state (single page) |
| Icons     | Lucide React                  |
| HTTP      | Axios                         |
| Backend   | Node.js, Express.js           |
| Database  | MongoDB, Mongoose ODM         |
| Validation | express-validator (server), custom utils (client) |
| Config    | dotenv                        |

---

## Folder Structure

```
Feedback col.form/
├── client/                     # React/Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FeedbackForm.jsx
│   │   │   ├── FeedbackItem.jsx
│   │   │   ├── FeedbackList.jsx
│   │   │   ├── ModalComponent.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── StatsCard.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── feedbackService.js
│   │   ├── utils/
│   │   │   ├── dateUtils.js
│   │   │   └── validators.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   └── package.json
│
└── server/                     # Node.js/Express backend
    ├── config/
    │   └── database.js
    ├── controllers/
    │   └── feedbackController.js
    ├── middleware/
    │   └── errorMiddleware.js
    ├── models/
    │   └── Feedback.js
    ├── routes/
    │   └── feedbackRoutes.js
    ├── server.js
    ├── .env
    ├── .env.example
    └── package.json
```

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v8 or higher
- **MongoDB** v6 or higher (running locally or a MongoDB Atlas URI)

---

## Installation

### 1. Clone / navigate to the project

```bash
cd "Feedback col.form"
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

---

## MongoDB Setup

### Option A — Local MongoDB

Install MongoDB Community Edition (macOS via Homebrew):

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

MongoDB will listen on `mongodb://localhost:27017` by default.

### Option B — MongoDB Atlas (cloud)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get your connection string
3. Set it as `MONGODB_URI` in `server/.env`

---

## Environment Variables

### Backend — `server/.env`

Copy the example file and edit it:

```bash
cp server/.env.example server/.env
```

| Variable      | Default                                        | Description                 |
|---------------|------------------------------------------------|-----------------------------|
| `PORT`        | `5000`                                         | Port the Express server listens on |
| `MONGODB_URI` | `mongodb://localhost:27017/feedback_collector` | MongoDB connection string   |
| `NODE_ENV`    | `development`                                  | Environment mode            |

### Frontend — `client/.env`

Already created. Edit if your backend runs on a different port:

| Variable            | Default                        | Description             |
|---------------------|--------------------------------|-------------------------|
| `VITE_API_BASE_URL` | `http://localhost:5000/api`    | Backend API base URL    |

---

## Running the Application

> You need **two terminal windows** — one for the backend, one for the frontend.

### Terminal 1 — Start the backend

```bash
cd server
npm run dev       # development (nodemon, auto-restart)
# or
npm start         # production
```

Expected output:
```
===========================================
  Feedback Collector API
  Server running on port 5000
  Environment: development
  URL: http://localhost:5000
===========================================
MongoDB Connected: localhost
```

### Terminal 2 — Start the frontend

```bash
cd client
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint              | Description                        | Status Codes         |
|--------|-----------------------|------------------------------------|----------------------|
| GET    | `/feedback`           | Get all feedback (newest first)    | 200                  |
| GET    | `/feedback/stats`     | Get total / today / this-week counts | 200               |
| GET    | `/feedback/:id`       | Get single feedback entry          | 200, 400, 404        |
| POST   | `/feedback`           | Create new feedback entry          | 201, 400             |
| DELETE | `/feedback/:id`       | Delete feedback entry              | 200, 400, 404        |

### POST `/feedback` — Request Body

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "message": "Great product, really enjoyed using it!"
}
```

### GET `/feedback/stats` — Response

```json
{
  "success": true,
  "data": {
    "total": 42,
    "today": 5,
    "thisWeek": 18
  }
}
```

---

## Testing Checklist

After starting both servers:

- [ ] App loads at http://localhost:5173
- [ ] Dashboard shows 0 total / today / this week stats
- [ ] "Add Feedback" opens the form modal
- [ ] Submitting an empty form shows validation errors
- [ ] Valid form submission creates feedback and closes modal
- [ ] Dashboard stats update after submission
- [ ] Feedback appears in the list immediately
- [ ] Refreshing the page preserves all feedback (data from MongoDB)
- [ ] Keyword search filters by name, email, and message
- [ ] Date filter shows only entries from that day
- [ ] Both filters work simultaneously
- [ ] "Clear filters" resets both filters
- [ ] Delete button opens confirmation modal
- [ ] Clicking Cancel in the modal keeps the record
- [ ] Clicking Confirm Delete removes the record from list and MongoDB
- [ ] Mobile layout is usable at 375px width

---

## Dependencies

### Backend

```
express          REST framework
mongoose         MongoDB ODM
cors             Cross-origin request handling
dotenv           Environment variable loading
express-validator  Server-side input validation
nodemon (dev)    Auto-restart on file changes
```

### Frontend

```
react            UI library
react-dom        DOM rendering
vite             Build tool and dev server
axios            HTTP client
lucide-react     Icon library
```

---

## Known Limitations

- No authentication — anyone can submit or delete feedback
- No pagination — all feedback is loaded at once (suitable for moderate volumes)
- Filtering is client-side — for large datasets, move search/filter to the backend query
- Single page — the sidebar "All Feedback" nav item shows the same Dashboard view (can be extended to a separate route with React Router)
