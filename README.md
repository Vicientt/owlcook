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
| **Backend** | Node.js, Express 5, MongoDB (Mongoose), JWT, bcrypt |
| **AI** | OpenAI GPT-4 (recipe generation) |

---

## Project Structure

```
tigercook_test/
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
└── DOCS.md
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
SECRET=<jwt-secret>
OPENAI_API_KEY=sk-...
PORT=3001
```

For tests: `TEST_MONGODB_URI`, `TEST_MONGODB_URI` (when `NODE_ENV=test`).

### Run the Application

**1. Backend:**

```bash
cd backend
npm install
npm run dev      # Development
npm run dev:test # Test env
```

Backend runs on `http://localhost:3001`.

**2. Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`. Vite proxies `/api` to `http://localhost:3001`.

---

## Architecture Overview

### Request Flow

1. User opens app → React Router loads route.
2. Protected routes: loader checks `localStorage.UserInformation`; if missing → redirect to `/`.
3. API calls use `axiosInstance`, which adds `Authorization` header.
4. Backend: `tokenExtractor` reads JWT, `userExtractor` (per-route) validates token and loads user.
5. On 401/403 or JWT errors: frontend interceptor clears storage and redirects to `/`.

### Frontend

- **`main.jsx`** – Entry point; imports `axiosInstance` so interceptors are registered.
- **`App.jsx`** – Restores token from `localStorage` into services on app load.
- **`routes.jsx`** – Defines routes and loaders.
- **`axiosInstance.js`** – Shared axios instance with request/response interceptors.
- **`theme.css`** – CSS variables for colors, typography, spacing.

### Backend

- **`app.js`** – Express setup, middleware, routers.
- **`index.js`** – Starts HTTP server.
- **`utils/middleware.js`** – `tokenExtractor`, `userExtractor`, `errorHandler`.
- **`utils/prompt.js`** – GPT prompt for recipe generation.

---

## Authentication

### Flow

1. **Login** (`POST /api/login`) – Validates email/password, returns JWT.
2. **Token storage** – Frontend stores `{ token, email, name }` in `localStorage` under `UserInformation`.
3. **Token restoration** – On app load, `App.jsx` reads token and calls `foodService.setToken()` / `userService.setToken()`.
4. **API requests** – `axiosInstance` request interceptor adds `Authorization: Bearer <token>`.
5. **Auth errors** – Response interceptor detects 401/403 or JWT-related messages, clears `localStorage`, and redirects to `/`.

### Token Validation

- **Backend:** `tokenExtractor` reads Bearer token; `userExtractor` verifies via JWT and loads user from DB.
- **Frontend:** Response interceptor checks status/message; on auth error → redirect to login.

---

## Routing

| Path | Component | Auth | Loader |
|------|-----------|------|--------|
| `/` | Login | No | - |
| `/signup` | SignUp | No | - |
| `/dashboard` | Dashboard | Yes | - |
| `/generator` | RecipeGenerator | Yes | - |
| `/recipe/:id` | RecipeAnswer | Yes | `foodService.getById(id)` |
| `/answer` | RecipeAnswer | Yes | - |
| `/explore` | Explore | Yes | - |
| `/explore/:id` | RecipeAnswer | Yes | Local `recipes.find(id)` |
| `/favorites` | Favorites | Yes | `foodService.getAll()` |
| `/profile` | Profile | Yes | - |
| `*` | NotFound | Yes | - |

**Protected routes** are wrapped in a parent route whose loader enforces `localStorage.UserInformation`.

---

## API Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Login; body: `{ email, password }` |
| POST | `/api/users` | Register; body: `{ name, email, password }` |
| PUT | `/api/users` | Update profile/password; requires Bearer token |

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
- On 401/403 or JWT errors → clear storage and redirect to `/`.

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
