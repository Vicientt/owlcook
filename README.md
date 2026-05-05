# OwlCook – AI Recipe Companion

OwlCook is a full-stack web application that helps college students discover, generate, and save recipes. Users can browse a curated recipe library, generate AI-powered custom recipes based on their budget, diet, and cuisine preferences, and save their favorites to a personal collection backed by a MariaDB database.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Overview](#project-overview)
3. [How to Use](#how-to-use)
4. [Installation & Setup](#installation--setup)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [CI/CD & Deployment](#cicd--deployment)
8. [Testing](#testing)
9. [AI Reflection](#ai-reflection)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, React Router 7, Vite 6, Bootstrap 5, Tailwind CSS 4, Axios |
| **Backend** | Node.js, Express 5, express-session, bcrypt |
| **Database** | MariaDB / MySQL (mysql2) |
| **AI** | OpenAI GPT-4o (recipe generation) |
| **Testing** | Vitest, Supertest, React Testing Library, Playwright |
| **CI/CD** | GitHub Actions, PM2 |

---

## Project Overview

**What it does:** OwlCook lets users sign up, log in, and get personalized AI-generated recipes based on their budget, portion size, cooking time, diet type, and cuisine preference. They can also explore a library of pre-built recipes and save any recipe to their personal favorites list.

**Who uses it:** College students who want quick, budget-friendly meal ideas without extensive cooking knowledge.

**Problem it solves:** Students often don't know what to cook given their limited budget and time. OwlCook takes those constraints as input and returns a fully detailed recipe — ingredients, steps, nutrition facts — in seconds.

**Key Features:**
- User registration and login (session-based auth with bcrypt)
- AI recipe generator with 5 user-controlled parameters
- Explore page with searchable pre-built recipes
- Favorites page — personal recipe collection saved to MariaDB
- Full CRUD on saved recipes (create, view, edit, delete)
- Profile page with name and password update

---

## How to Use

### Typical User Workflow

1. **Sign Up** — Go to `/signup`, enter your name, email, and password.
2. **Log In** — On the login page (`/`), enter your email and password.
3. **Dashboard** — Overview of your recent activity.
4. **Generate a Recipe** — Go to `/generator`, set your preferences (budget, portions, cooking time, diet, cuisine), and click Generate. The AI returns a full recipe.
5. **Save a Recipe** — On any recipe result page, click **Save to Favorites**.
6. **View Favorites** — Go to `/favorites` to see all saved recipes.
7. **Edit or Delete a Recipe** — Open a saved recipe and use the Edit or Delete buttons.
8. **Explore** — Browse the pre-built recipe library at `/explore`. Search by name.
9. **Update Profile** — Go to `/profile` to change your display name or password.
10. **Log Out** — Click Logout in the navigation bar.

---

## Installation & Setup

### Prerequisites

- Node.js 18+
- MariaDB or MySQL (local or remote)
- OpenAI API key

### 1. Clone the repo

```bash
git clone <repo-url>
cd owlcook
```

### 2. Install all dependencies

```bash
npm install
```

This installs root, backend, and frontend dependencies (via `install:all` in scripts).

Or install separately:

```bash
npm install --prefix backend
npm install --prefix frontend
```

### 3. Set up environment variables

Copy the example file and fill in your values:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=owlcook
TEST_DB_NAME=owlcook_test
SECRET=any_long_random_string
OPENAI_API_KEY=sk-...
PORT=4139
```

### 4. Set up the database

Apply the schema to your MariaDB instance:

```bash
mysql -u <user> -p <database> < docs/schema.sql
```

### 5. Run in development

```bash
npm run dev
```

- Backend: `http://localhost:4139`
- Frontend: `http://localhost:5173` (Vite proxies `/api` to the backend)

---

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  name          VARCHAR(255)        NOT NULL,
  password_hash VARCHAR(255)        NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS foods (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255),
  description TEXT,
  time        VARCHAR(100),
  cost        VARCHAR(100),
  servings    VARCHAR(100),
  difficulty  VARCHAR(100),
  ingredients JSON,
  steps       JSON,
  calories    VARCHAR(100),
  protein     VARCHAR(100),
  carbs       VARCHAR(100),
  fat         VARCHAR(100),
  user_id     INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Relationships:** Each `foods` row belongs to one `users` row via `user_id` (foreign key with `ON DELETE CASCADE`). A user can have many saved recipes.

---

## API Documentation

Base URL: `http://localhost:4139`

All authenticated routes require an active session cookie (`connect.sid`) set by `POST /api/login`.

---

### Authentication

#### `POST /api/users` — Register
- **Auth required:** No
- **Request body:**
  ```json
  { "name": "Alice", "email": "alice@example.com", "password": "secret123" }
  ```
- **Response 201:**
  ```json
  { "id": 1, "email": "alice@example.com", "name": "Alice" }
  ```
- **Response 400:** `{ "error": "name must be at least 3 characters" }` / duplicate email

---

#### `POST /api/login` — Login
- **Auth required:** No
- **Request body:**
  ```json
  { "email": "alice@example.com", "password": "secret123" }
  ```
- **Response 200:** Sets `connect.sid` session cookie
  ```json
  { "id": 1, "email": "alice@example.com", "name": "Alice" }
  ```
- **Response 401:** `{ "error": "invalid email or password" }`

---

#### `POST /api/logout` — Logout
- **Auth required:** No (but destroys active session)
- **Request body:** None
- **Response 200:** `{ "message": "logged out" }`

---

#### `GET /api/me` — Get current user
- **Auth required:** Yes (session cookie)
- **Response 200:**
  ```json
  { "id": 1, "email": "alice@example.com", "name": "Alice" }
  ```
- **Response 401:** `{ "error": "unauthorized" }`

---

#### `PUT /api/users` — Update profile or password
- **Auth required:** Yes
- **Request body (name update):**
  ```json
  { "name": "Alice Smith" }
  ```
- **Request body (password change):**
  ```json
  { "currentPassword": "oldpass", "newPassword": "newpass123" }
  ```
- **Response 200:**
  ```json
  { "id": 1, "email": "alice@example.com", "name": "Alice Smith" }
  ```

---

### Recipes (Food)

#### `GET /api/food` — List user's saved recipes
- **Auth required:** Yes
- **Response 200:** Array of recipe objects
  ```json
  [
    {
      "id": 5,
      "name": "Pasta Primavera",
      "description": "...",
      "time": "30 min",
      "cost": "$8",
      "servings": "2",
      "difficulty": "Easy",
      "ingredients": [{ "name": "pasta", "amount": "200g" }],
      "steps": ["Boil water", "Cook pasta"],
      "nutritions": { "calories": "420", "protein": "14g", "carbs": "70g", "fat": "8g" },
      "user_id": 1,
      "created_at": "2026-05-01T10:00:00.000Z"
    }
  ]
  ```

---

#### `GET /api/food/:id` — Get recipe by ID
- **Auth required:** Yes
- **URL param:** `id` — recipe ID
- **Response 200:** Single recipe object (same shape as above)
- **Response 400:** `{ "error": "id request is not in the database" }`
- **Response 400:** `{ "error": "This id is not belong to this user!" }`

---

#### `POST /api/food` — Save a recipe
- **Auth required:** Yes
- **Request body:**
  ```json
  {
    "name": "Pasta Primavera",
    "description": "Quick veggie pasta",
    "time": "30 min",
    "cost": "$8",
    "servings": "2",
    "difficulty": "Easy",
    "ingredients": [{ "name": "pasta", "amount": "200g" }],
    "steps": ["Boil water", "Cook pasta"],
    "nutritions": { "calories": "420", "protein": "14g", "carbs": "70g", "fat": "8g" }
  }
  ```
- **Response 201:** Created recipe object with `id` and `created_at`

---

#### `PUT /api/food/:id` — Update a saved recipe
- **Auth required:** Yes
- **URL param:** `id` — recipe ID
- **Request body:** Any subset of recipe fields to update
  ```json
  { "name": "Updated Pasta", "difficulty": "Medium" }
  ```
- **Response 200:** Updated recipe object
- **Response 400:** `{ "error": "id request is not in the database" }`
- **Response 400:** `{ "error": "This id is not belong to this user!" }`

---

#### `DELETE /api/food/:id` — Delete a saved recipe
- **Auth required:** Yes
- **URL param:** `id` — recipe ID
- **Response 204:** No content
- **Response 400:** `{ "error": "id request is not in the database" }`

---

### Recipe Generation

#### `POST /api/generator` — Generate a recipe with GPT-4o
- **Auth required:** No (but users must be logged in to save the result)
- **Request body:**
  ```json
  {
    "budget": "10",
    "portion": "2",
    "cookingTime": "30",
    "diet": "vegetarian",
    "cuisine": "Italian"
  }
  ```
- **Response 200:** Full recipe JSON object (same shape as food object, without `id`/`user_id`/`created_at`)
- **Response 500:** `{ "error": "Failed to generate recipe" }`

---

## CI/CD & Deployment

### CI (GitHub Actions — `.github/workflows/ci.yml`)

Runs automatically on every push and pull request:
1. Spins up a MariaDB service container
2. Installs all dependencies
3. Applies `docs/schema.sql` to the test database
4. Runs backend tests (Vitest + Supertest)
5. Runs frontend tests (Vitest + Testing Library)
6. Builds the frontend
7. Runs E2E tests (Playwright, Chromium)

### CD (GitHub Actions — `.github/workflows/cd.yml`)

Triggers automatically when CI passes on the `main` branch. Runs on a self-hosted runner on the production server and executes `./deploy.sh`.

### `deploy.sh` steps

1. `git pull` — pull latest code
2. `npm install` — install/update dependencies
3. Build frontend: `npm run build --prefix frontend`
4. Copy build to backend: `rm -rf backend/dist && cp -r frontend/dist backend/dist`
5. Apply schema: `mysql ... < docs/schema.sql`
6. `pm2 restart owlcook` — restart the Node.js process

### Running with PM2 (first-time setup on server)

```bash
cd ~/sd/owlcook/backend
pm2 start index.js --name owlcook
pm2 save                         # persist process across reboots
pm2 startup                      # generate startup script
```

After that, `deploy.sh` handles updates automatically via `pm2 restart owlcook`.

**Production server:** `10.192.145.179`, port `4139`

---

## Testing

```bash
npm test                # all tests (backend + frontend + E2E)
npm run test:backend    # 3 backend API tests (Vitest + Supertest)
npm run test:frontend   # 3 frontend UI tests (Vitest + Testing Library)
npm run test:e2e        # 3 E2E tests (Playwright, Chromium)
```

| Layer | Tool | Coverage |
|-------|------|----------|
| Backend | Vitest + Supertest | `POST /api/users` — success, validation, duplicate |
| Frontend | Vitest + Testing Library | Login heading, empty-field error, input rendering |
| E2E | Playwright | Page load, visible inputs, empty-form validation |

---

## AI Reflection

### How I Used AI

I used Claude (Anthropic) and ChatGPT (OpenAI) throughout development as a coding assistant — not to write the project for me, but to help with specific technical questions and boilerplate patterns I hadn't worked with before.

**Where AI helped:**

- **Express session setup:** I had not used `express-session` before. AI explained the difference between session-based auth and JWT clearly, and gave me a correct starting configuration for `express-session` including `httpOnly` cookies and `saveUninitialized: false`. This saved significant time versus reading through all the documentation myself.
- **bcrypt usage:** AI gave me the correct pattern for `bcrypt.hash` with salt rounds on registration and `bcrypt.compare` on login. The code it provided was correct and I used it almost as-is.
- **React Router 7 loaders:** The loader-based protected route pattern (calling `GET /api/me` in a route loader and throwing a redirect on 401) was suggested by AI. I had to verify this by reading the React Router 7 documentation because AI initially gave me React Router 6 syntax (`useNavigate` in a component), which does not work the same way in v7.
- **OpenAI API integration:** AI wrote the initial `prompt.js` with a structured JSON prompt format. This was mostly correct, but the schema it included for the response did not exactly match my database columns, so I had to revise it manually to align the nutrition field names with what my model expected.
- **SQL JOIN query:** For `findByUser`, AI suggested a `JOIN` on `users` to include the user's name and email in the food result. This was a good suggestion that I kept.

**Where AI was wrong:**

- **JWT in localStorage:** Early in development, AI suggested storing a JWT in `localStorage` for authentication. This is a known XSS security vulnerability. I rejected this approach and switched to `express-session` with `httpOnly` cookies, which keeps session data server-side and is not accessible to JavaScript.
- **Single JSON column for recipe:** AI first suggested storing the entire recipe as one JSON blob in a single database column (`recipe JSON`). This would make it harder to query and filter individual fields. I redesigned the schema to use separate columns for `difficulty`, `calories`, `time`, etc., which is better relational design.
- **React Router v6 patterns in v7:** As mentioned above, AI gave me outdated navigation patterns. I caught this by comparing with the official React Router 7 docs.

**How I verified AI output:**

- Tested every endpoint manually before writing automated tests.
- Cross-referenced AI-suggested API code with the official `express-session`, `mysql2`, and React Router 7 documentation.
- Ran `npm test` after every major change to catch regressions immediately.
- Checked session behavior using browser DevTools (Application → Cookies) to confirm the `connect.sid` cookie was being set and cleared correctly on login/logout.

**What I learned as a developer:**

- AI is a fast starting point but not a final answer. It often gives you working code for the common case but gets details wrong for your specific setup — especially when library versions differ from its training data.
- Reading official documentation is still essential. AI gave me the shape of the solution; the docs gave me the exact API.
- Security decisions should never come from AI alone. The JWT vs session question required me to think through the threat model myself (XSS risk, server-side vs client-side state) rather than accept the first suggestion.
- Debugging AI-generated code taught me more than copy-pasting it would have. When I had to fix the React Router loader pattern, I ended up understanding the data flow much better than if it had worked on the first try.
