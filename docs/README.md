# OwlCook – AI Recipe Companion

OwlCook is a full-stack web application that helps college students discover and create recipes. Users can browse predefined recipes, generate AI-powered recipes from preferences (budget, diet, cuisine, etc.), and save favorites. The app uses **Kenyon College** brand colors (Slate Blue `#432C91`) with a vibrant multi-color palette.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Architecture Overview](#architecture-overview)
5. [Authentication](#authentication)
6. [Routing](#routing)
7. [API Reference](#api-reference)
8. [Key Features](#key-features)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, React Router 7, Vite 6, Tailwind CSS 4, Axios, Lucide React (icons) |
| **Backend** | Node.js, Express 5, MongoDB (Mongoose), express-session, bcrypt |
| **AI** | OpenAI GPT-4 (recipe generation) |

---

## Project Structure

```
owlcook/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/       # Reusable UI (Navigation, Footer, Button, Input, Slider)
│   │   │   ├── pages/            # Route components (Login, Dashboard, Explore, etc.)
│   │   │   ├── services/         # API clients & axios instance
│   │   │   ├── utils/            # recipes.js (static recipe data)
│   │   │   ├── App.jsx
│   │   │   └── routes.jsx
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   └── theme.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── controllers/              # Express route handlers (login, user, food, generator)
│   ├── models/                   # Mongoose schemas (User, Food)
│   ├── utils/                    # middleware, config, logger, prompt
│   ├── app.js
│   ├── index.js
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key

### Environment Variables

Create `backend/.env`:

```
MONGODB_URI=mongodb+srv://...
SECRET=<session-secret>
OPENAI_API_KEY=sk-...
PORT=3001
```

For tests: `TEST_MONGODB_URI` (when `NODE_ENV=test`).

### Run the Application

**Option 1 – Run both at once (from repo root):**

```bash
npm install
npm run dev
```

**Option 2 – Run separately:**

**Backend:**

```bash
cd backend
npm install
npm run dev      # Development (port 3001)
npm run dev:test # Test env
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev      # Runs on http://localhost:5173
```

Frontend runs on `http://localhost:5173`. Vite proxies `/api` to `http://localhost:3001`.

---

## Architecture Overview

### Request Flow

1. User opens app → React Router loads route.
2. Protected route loader calls `GET /api/me`; if the server returns 401 (no active session) → redirect to `/`.
3. API calls use `axiosInstance` with `withCredentials: true` so the session cookie is sent automatically.
4. Backend: `userExtractor` middleware reads `req.session.userId` and attaches the full user object to `req.user`.
5. On 401 response: frontend interceptor redirects to `/`.

### Frontend

- **`main.jsx`** – Entry point; imports `axiosInstance` so interceptors are registered.
- **`App.jsx`** – App shell; routes are protected via loader.
- **`routes.jsx`** – Defines routes and loaders; protected routes call `/api/me` to verify session.
- **`axiosInstance.js`** – Shared axios instance with `withCredentials: true` and a response interceptor that handles 401s.
- **`theme.css`** – CSS variables for colors, typography, spacing.

### Backend

- **`app.js`** – Express setup, `express-session` config, middleware, routers.
- **`index.js`** – Starts HTTP server.
- **`utils/middleware.js`** – `userExtractor` (reads `req.session.userId`), `errorHandler`.
- **`utils/prompt.js`** – GPT prompt for recipe generation.

---

## Authentication

> **Auth path used: Cookie-based server sessions (`express-session`)**

### How It Works

1. **Register** (`POST /api/users`) – Hashes password with bcrypt and saves user to MongoDB.
2. **Login** (`POST /api/login`) – Validates email/password with bcrypt; on success sets `req.session.userId` and returns `{ id, email, name }`.
3. **Session cookie** – Express writes a `connect.sid` cookie (`httpOnly`, `maxAge` 24 hours) to the browser automatically.
4. **Subsequent requests** – Browser sends the cookie on every request; `userExtractor` middleware resolves the user from `req.session.userId`.
5. **Session check** (`GET /api/me`) – Used by route loaders to verify an active session; returns current user or 401.
6. **Logout** (`POST /api/logout`) – Calls `req.session.destroy()` and clears the `connect.sid` cookie.

### Session Configuration (backend `app.js`)

```js
app.use(session({
  secret: config.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }  // 24 hours
}))
```

### Notes

- No tokens are stored in `localStorage`; all auth state lives server-side.
- The session store is **in-memory** (default). Sessions are valid for 24 hours but will be lost on server restart.
- Protected API routes use the `userExtractor` middleware.

---

## Routing

| Path | Component | Auth | Loader |
|------|-----------|------|--------|
| `/` | Login | No | - |
| `/signup` | SignUp | No | - |
| `/dashboard` | Dashboard | Yes | `GET /api/me` |
| `/generator` | RecipeGenerator | Yes | `GET /api/me` |
| `/recipe/:id` | RecipeAnswer | Yes | `foodService.getById(id)` |
| `/answer` | RecipeAnswer | Yes | - |
| `/explore` | Explore | Yes | `GET /api/me` |
| `/explore/:id` | RecipeAnswer | Yes | Local `recipes.find(id)` |
| `/favorites` | Favorites | Yes | `foodService.getAll()` |
| `/profile` | Profile | Yes | `GET /api/me` |
| `*` | NotFound | Yes | - |

**Protected routes** are wrapped in a parent route whose loader calls `GET /api/me`. A 401 response redirects the user to `/`.

---

## API Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Register; body: `{ name, email, password }` |
| POST | `/api/login` | Login; body: `{ email, password }`; sets session cookie |
| POST | `/api/logout` | Logout; destroys session and clears cookie |
| GET | `/api/me` | Returns current user `{ id, email, name }` or 401 |
| PUT | `/api/users` | Update profile/password; requires active session |

### Recipes (Food)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/food` | List user's saved recipes | Yes |
| GET | `/api/food/:id` | Get recipe by ID | Yes |
| POST | `/api/food` | Save recipe | Yes |
| DELETE | `/api/food/:id` | Remove saved recipe | Yes |

### Recipe Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generator` | Generate recipe with GPT-4; body: `{ budget, portion, cookingTime, diet, cuisine }` |

---

## Key Features

### 1. AI Recipe Generator

- User sets budget, servings, cooking time, diet, cuisine.
- Backend sends structured prompt to GPT-4; returns a JSON recipe.
- Recipe is shown on `RecipeAnswer` and can be saved.

### 2. Explore Recipes

- Static recipes from `utils/recipes.js`.
- Search by name.
- Click a card → `/explore/:id`; recipe loaded from local data.

### 3. Favorites

- Saved recipes stored in MongoDB with user reference.
- Each recipe has: name, description, time, cost, servings, difficulty, ingredients, steps, nutritions.
- Favorites page shows level and calories in colored boxes.

### 4. 401 Handling

- Shared axios instance (`axiosInstance.js`) with response interceptor.
- On 401 → redirect to `/`.

### 5. Not Found

- Unknown URLs render `NotFound` with links to Dashboard and Explore.

### 6. Theme

- Primary: Kenyon Slate Blue `#432C91`.
- Additional: Teal, Amber, Rose, Emerald for sections and accents.
- Gradients used across headers, buttons, and badges.

---

## Recipe Data Shape

```javascript
{
  id: String,
  name: String,
  description: String,
  image: String,
  time: String,        // e.g. "25 min"
  cost: String,
  servings: String,
  difficulty: String,  // Easy, Medium, Hard
  category: String,
  ingredients: [{ name, amount }],
  steps: [String],
  nutritions: { calories, protein, carbs, fat }
}
```

---

## Vite Proxy

`vite.config.js` proxies `/api` to `http://localhost:3001` so the frontend can call the backend at the same origin during development.
